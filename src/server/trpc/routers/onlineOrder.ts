import { protectedProcedure, router } from "../trpc"
import { z } from "zod"
import {
  attachPaymentMethodToIntent,
  createPaymentIntent,
  createPaymentMethod,
} from "@/server/payment-gateway"
import { TRPCError } from "@trpc/server"
import { getBaseUrl } from "@/utils/base-url"
import { getDiscountedPrice } from "@/utils/discounted-price"

export const onlineOrderRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.onlineOrder.findMany({
      where: {
        customerId: ctx.user.uid,
      },
      include: {
        order: {
          include: {
            orderItems: true,
          },
        },
      },
    })
  }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.onlineOrder.findUnique({
        where: {
          id: input.id,
        },
        include: {
          order: {
            include: {
              orderItems: {
                include: {
                  menuItem: {
                    include: {
                      discountItems: {
                        include: {
                          discount: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        customerName: z.string().min(1),
        contactNumber: z.string().length(11),
        address: z.string().min(1),
        additionalNotes: z.string(),
        selectedItems: z
          .object({
            id: z.number(),
            quantity: z.number(),
          })
          .array()
          .nonempty(),
        deliveryFee: z.number(),
        paymentMethod: z.union([z.literal("MAYA"), z.literal("GCASH")]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const selectedItemIds = input.selectedItems.flatMap(
        (selectedItem) => selectedItem.id
      )

      const selectedMenuItems = await ctx.prisma.menuItem.findMany({
        where: {
          id: {
            in: selectedItemIds,
          },
        },
        include: {
          discountItems: {
            include: {
              discount: true,
            },
          },
        },
      })

      const selectedItemWithMenuItem = input.selectedItems.map(
        (selectedItem) => {
          const menuItem = selectedMenuItems.find(
            (menuItem) => menuItem.id === selectedItem.id
          )

          if (menuItem === undefined)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid ID found on one or more selected items",
            })

          return {
            id: selectedItem.id,
            quantity: selectedItem.quantity,
            menuItem,
          }
        }
      )

      const totalAmountToPay =
        selectedItemWithMenuItem.reduce((runningTally, selectedItem) => {
          const { hasDiscount, originalPrice, discountedPrice } =
            getDiscountedPrice(selectedItem.menuItem)
          if (hasDiscount)
            return runningTally + selectedItem.quantity * discountedPrice

          return runningTally + selectedItem.quantity * originalPrice
        }, 0) + input.deliveryFee

      const totalAmountToPayInCentavos = totalAmountToPay * 100

      if (totalAmountToPayInCentavos < 10000)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Minimum amount to be paid should be ₱100",
        })

      const paymentIntent = await createPaymentIntent(
        totalAmountToPayInCentavos
      )

      const returnUrl = `${getBaseUrl()}/api/order/redirect/by-intent-id`
      const paymentMethod = await createPaymentMethod(input.paymentMethod)
      const attachedPaymentIntent = await attachPaymentMethodToIntent(
        paymentMethod.data.id,
        paymentIntent.data.id,
        returnUrl
      )

      if (!attachedPaymentIntent.data.attributes.next_action)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not obtain checkout URL",
        })

      const { url, return_url } =
        attachedPaymentIntent.data.attributes.next_action.redirect

      // Create order with generated payment intent ID.
      const orderItemsData = input.selectedItems.map((selectedItem) => {
        const menuItem = selectedMenuItems.find(
          (selectedMenuItem) => selectedMenuItem.id === selectedItem.id
        )

        if (!menuItem)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid item ID: No such menu item",
          })

        return {
          menuItemId: selectedItem.id,
          quantity: selectedItem.quantity,
          price: menuItem.price,
          discount: 0,
        }
      })

      await ctx.prisma.$transaction([
        ctx.prisma.order.create({
          data: {
            mode: "Online",
            customerName: input.customerName,
            onlineOrders: {
              create: {
                customerId: ctx.user.uid,
                address: input.address,
                contactNumber: input.contactNumber,
                deliveryFee: input.deliveryFee,
                paymentIntentId: paymentIntent.data.id,
                additionalNotes: input.additionalNotes,
              },
            },
            orderItems: {
              createMany: {
                data: orderItemsData,
              },
            },
          },
        }),
        ctx.prisma.basketItem.deleteMany({
          where: {
            customerId: ctx.user.uid,
            menuItemId: {
              in: selectedItemIds,
            },
          },
        }),
      ])

      return {
        paymentUrl: url,
        returnUrl: return_url,
      }
    }),
  received: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.onlineOrder.update({
        where: {
          id: input.id,
        },
        data: {
          deliveryStatus: "Received",
        },
      })
    }),
  cancel: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.onlineOrder.update({
        where: {
          id: input.id,
        },
        data: {
          deliveryStatus: "Cancelled",
        },
      })
    }),
  cancelPayment: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.$transaction([
        ctx.prisma.onlineOrder.update({
          where: {
            id: input.id,
          },
          data: {
            deliveryStatus: "Cancelled",
          },
        }),
        ctx.prisma.order.update({
          where: {
            id: input.id,
          },
          data: {
            paymentStatus: "Cancelled",
          },
        }),
      ])
    }),
})

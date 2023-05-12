import { protectedProcedure, router } from "../trpc"
import { z } from "zod"

export const basketItemRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.basketItem.findMany({
      where: {
        customerId: ctx.user.uid,
      },
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
    })
  }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.basketItem.findUnique({
        where: {
          id: input.id,
        },
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        menuItemId: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.basketItem.create({
        data: {
          customerId: ctx.user.uid,
          menuItemId: input.menuItemId,
        },
      })
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.basketItem.delete({
        where: {
          id: input.id,
        },
      })
    }),
  removeMenuItem: protectedProcedure
    .input(
      z.object({
        menuItemId: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.basketItem.deleteMany({
        where: {
          customerId: ctx.user.uid,
          menuItemId: input.menuItemId,
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        quantity: z.number().min(1).max(15),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.basketItem.update({
        where: {
          id: input.id,
        },
        data: {
          quantity: input.quantity,
        },
      })
    }),
})

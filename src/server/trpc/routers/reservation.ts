import { protectedProcedure, router } from "../trpc"
import { z } from "zod"
import {
  attachPaymentMethodToIntent,
  createPaymentIntent,
  createPaymentMethod,
} from "@/server/payment-gateway"
import { TRPCError } from "@trpc/server"
import {
  VALID_CONTACT_NUMBER,
  VALID_DATE_REGEX,
} from "@/utils/validation-patterns"
import { DateTime } from "luxon"
import { getBaseUrl } from "@/utils/base-url"

export const reservationRouter = router({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.reservation.findUnique({
        where: {
          id: input.id,
        },
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        customerName: z.string(),
        contactNumber: z.string().regex(VALID_CONTACT_NUMBER, {
          message: "Invalid contact number",
        }),
        reservationDate: z.string().regex(VALID_DATE_REGEX, {
          message: "Invalid date",
        }),
        additionalNotes: z.string(),
        selectedTimeslots: z
          .string()
          .datetime({
            offset: true,
          })
          .array()
          .nonempty(),
        selectedTableslots: z.string().array().nonempty(),
        fee: z.number(),
        paymentMethod: z.union([z.literal("MAYA"), z.literal("GCASH")]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const totalAmountToPayInCentavos = input.fee * 100

      if (totalAmountToPayInCentavos < 10000)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Minimum amount to be paid should be ₱100",
        })

      const paymentIntent = await createPaymentIntent(
        totalAmountToPayInCentavos
      )

      const returnUrl = `${getBaseUrl()}/api/reservation/redirect/by-intent-id`
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

      // Create reservation with generated payment intent ID.
      try {
        const data = input.selectedTableslots
          .map((tableslotId) => {
            return input.selectedTimeslots.map((timeslot) => {
              const endIsoDate = DateTime.fromISO(timeslot)
                .plus({
                  hour: 1,
                })
                .toISO()

              if (!endIsoDate) throw new Error("Computed invalid end time")

              return {
                startIsoDate: timeslot,
                endIsoDate,
                reservationTableId: tableslotId,
              }
            })
          })
          .flat(1)

        await ctx.prisma.reservation.create({
          data: {
            customerId: ctx.user.uid,
            paymentIntentId: paymentIntent.data.id,
            fee: input.fee,
            additionalNotes: input.additionalNotes,
            reservationSlots: {
              createMany: {
                data,
              },
            },
          },
        })
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create reservation",
          cause: e,
        })
      }

      return {
        paymentUrl: url,
        returnUrl: return_url,
      }
    }),
  getAllTableIds: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.reservationTable.findMany()
  }),
  getAvailableTableIdsForTimeslots: protectedProcedure
    .input(
      z.object({
        selectedTimeslots: z
          .string()
          .datetime({
            offset: true,
          })
          .array(),
      })
    )
    .query(async ({ ctx, input }) => {
      const reservationSlotsForSelectedTimeslots =
        await ctx.prisma.reservationSlot.findMany({
          where: {
            startIsoDate: {
              in: input.selectedTimeslots,
            },
          },
        })

      const reservationTables = await ctx.prisma.reservationTable.findMany()
      const availableReservationTableIds = reservationTables
        .filter(
          (reservationTable) =>
            !reservationSlotsForSelectedTimeslots.some(
              (reservationSlot) =>
                reservationSlot.reservationTableId === reservationTable.id
            )
        )
        .map((reservationTable) => reservationTable.id)

      return availableReservationTableIds
    }),
  getReservedSlotsByStartIsoDate: protectedProcedure
    .input(
      z.object({
        startIsoDate: z.string().datetime({
          offset: true,
        }),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.reservationSlot.findMany({
        where: {
          startIsoDate: input.startIsoDate,
        },
      })
    }),
  // isTimeslotReserved: protectedProcedure
  //   .input(
  //     z.object({
  //       isoDate: z.string().datetime({
  //         offset: true,
  //       }),
  //     })
  //   )
  //   .query(async ({ input, ctx }) => {
  //     const reservationTimeslot =
  //       await ctx.prisma.reservationTimeslot.findUnique({
  //         where: {
  //           startIsoDate: input.isoDate,
  //         },
  //       })

  //     if (reservationTimeslot) return true
  //     else return false
  //   }),
  isSlotReserved: protectedProcedure
    .input(
      z.object({
        startIsoDate: z.string().datetime({
          offset: true,
        }),
        tableId: z.string().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      const reservationTableslot = await ctx.prisma.reservationSlot.findUnique({
        where: {
          startIsoDate_reservationTableId: {
            startIsoDate: input.startIsoDate,
            reservationTableId: input.tableId,
          },
        },
      })

      if (reservationTableslot) return true
      else return false
    }),
})

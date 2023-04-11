import { protectedProcedure, router } from "../trpc"
import { z } from "zod"
import {
  attachPaymentMethodToIntent,
  createPaymentMethod,
  getPaymentIntent,
  getSource,
} from "@/server/payment-gateway"

export const paymentRouter = router({
  getPaymentIntent: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input }) => {
      return getPaymentIntent(input.id)
    }),
  refreshPaymentIntent: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        paymentMethod: z.union([z.literal("MAYA"), z.literal("GCASH")]),
      })
    )
    .mutation(async ({ input }) => {
      const paymentMethod = await createPaymentMethod(input.paymentMethod)
      return attachPaymentMethodToIntent(paymentMethod.data.id, input.id)
    }),
  getSource: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input }) => {
      return getSource(input.id)
    }),
})

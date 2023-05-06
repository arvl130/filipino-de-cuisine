import { protectedProcedure, router } from "../trpc"
import { z } from "zod"
import {
  attachPaymentMethodToIntent,
  createPaymentMethod,
  getPaymentIntent,
  getSource,
} from "@/server/payment-gateway"
import { getBaseUrl } from "@/utils/base-url"

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
        paymentFor: z.union([z.literal("ORDER"), z.literal("RESERVATION")]),
      })
    )
    .mutation(async ({ input }) => {
      const returnUrl = `${getBaseUrl()}/api/${input.paymentFor.toLowerCase()}/redirect/by-intent-id`

      const paymentMethod = await createPaymentMethod(input.paymentMethod)
      return attachPaymentMethodToIntent(
        paymentMethod.data.id,
        input.id,
        returnUrl
      )
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

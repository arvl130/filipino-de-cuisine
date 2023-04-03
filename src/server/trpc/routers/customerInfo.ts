import { protectedProcedure, router } from "../trpc"
import { z } from "zod"

const VALID_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const VALID_CONTACT_NUMBER = /^09\d{9}$/

export const customerInfoRouter = router({
  update: protectedProcedure
    .input(
      z.object({
        dateOfBirth: z.string().regex(VALID_DATE_REGEX, {
          message: "Invalid date",
        }),
        defaultAddress: z.string().min(1),
        defaultContactNumber: z.string().regex(VALID_CONTACT_NUMBER, {
          message: "Invalid contact number",
        }),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.customerInfo.upsert({
        where: {
          id: ctx.user.uid,
        },
        update: {
          defaultAddress: input.defaultAddress,
          defaultContactNumber: input.defaultContactNumber,
          dateOfBirth: new Date(input.dateOfBirth),
        },
        create: {
          defaultAddress: input.defaultAddress,
          defaultContactNumber: input.defaultContactNumber,
          dateOfBirth: new Date(input.dateOfBirth),
        },
      })
    }),
})

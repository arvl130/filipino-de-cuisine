import { updateProfile } from "@/server/auth"
import { protectedProcedure, router } from "../trpc"
import { z } from "zod"
import {
  VALID_CONTACT_NUMBER,
  VALID_DATE_REGEX,
} from "@/utils/validation-patterns"

export const customerInfoRouter = router({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.customerInfo.findUnique({
      where: {
        id: ctx.user.uid,
      },
    })
  }),
  update: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1),
        dateOfBirth: z.string().regex(VALID_DATE_REGEX, {
          message: "Invalid date",
        }),
        defaultAddress: z.string().min(1),
        defaultContactNumber: z.string().regex(VALID_CONTACT_NUMBER, {
          message: "Invalid contact number",
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.customerInfo.upsert({
        where: {
          id: ctx.user.uid,
        },
        update: {
          defaultAddress: input.defaultAddress,
          defaultContactNumber: input.defaultContactNumber,
          dateOfBirth: new Date(input.dateOfBirth),
        },
        create: {
          id: ctx.user.uid,
          defaultAddress: input.defaultAddress,
          defaultContactNumber: input.defaultContactNumber,
          dateOfBirth: new Date(input.dateOfBirth),
        },
      })

      await updateProfile(ctx.user, {
        displayName: input.displayName,
      })
    }),
})

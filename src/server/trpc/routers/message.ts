import { publicProcedure, router } from "../trpc"
import { z } from "zod"

export const messageRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        body: z.string().min(1),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.message.create({
        data: {
          name: input.name,
          email: input.email,
          body: input.body,
        },
      })
    }),
})

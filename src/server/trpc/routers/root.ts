import { z } from "zod"
import { publicProcedure, router } from "../trpc"

export const rootRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `Hello, ${input.text}`,
      }
    }),
})

export type RootRouter = typeof rootRouter

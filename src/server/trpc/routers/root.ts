import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { menuItemRouter } from "./menuItem"

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
  menuItem: menuItemRouter,
})

export type RootRouter = typeof rootRouter

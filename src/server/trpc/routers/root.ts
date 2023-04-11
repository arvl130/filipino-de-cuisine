import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import { menuItemRouter } from "./menuItem"
import { customerInfoRouter } from "./customerInfo"
import { paymentRouter } from "./payment"
import { onlineOrderRouter } from "./onlineOrder"

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
  customerInfo: customerInfoRouter,
  payment: paymentRouter,
  onlineOrder: onlineOrderRouter,
})

export type RootRouter = typeof rootRouter

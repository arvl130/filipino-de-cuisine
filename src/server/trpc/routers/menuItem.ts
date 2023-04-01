import { publicProcedure, router } from "../trpc"
import { z } from "zod"

export const menuItemRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.menuItem.findMany()
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      return ctx.prisma.menuItem.findUnique({
        where: {
          id: input.id,
        },
      })
    }),
  getManyById: publicProcedure
    .input(
      z.object({
        ids: z.number().array(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.menuItem.findMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      })
    }),
})

import { publicProcedure, router } from "../trpc"
import { z } from "zod"

export const menuItemRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.menuItem.findMany({
      include: {
        discountItems: {
          include: {
            discount: true,
          },
        },
      },
    })
  }),
  getFeatured: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.menuItem.findMany({
      where: {
        id: {
          in: [3, 6, 7],
        },
      },
      include: {
        discountItems: {
          include: {
            discount: true,
          },
        },
      },
    })
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
        include: {
          discountItems: {
            include: {
              discount: true,
            },
          },
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

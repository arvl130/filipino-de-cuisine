import { initTRPC, TRPCError } from "@trpc/server"
import { prisma } from "../db"
import { CreateNextContextOptions } from "@trpc/server/adapters/next"
import { getServerSession } from "../auth"

export async function createContext({ req, res }: CreateNextContextOptions) {
  const session = await getServerSession({ req, res })

  return {
    user: session?.user,
    prisma,
  }
}

const t = initTRPC.context<typeof createContext>().create()

export const router = t.router
export const publicProcedure = t.procedure

const hasUser = t.middleware(({ ctx: { user }, next }) => {
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      user,
    },
  })
})

export const protectedProcedure = t.procedure.use(hasUser)

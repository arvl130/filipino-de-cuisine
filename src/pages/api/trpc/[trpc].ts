import * as trpcNext from "@trpc/server/adapters/next"
import { rootRouter } from "@/server/trpc/routers/root"
import { createContext } from "@/server/trpc/trpc"

export default trpcNext.createNextApiHandler({
  router: rootRouter,
  createContext,
})

import { httpBatchLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"
import type { RootRouter } from "../server/trpc/routers/root"
import { getIdToken } from "firebase/auth"
import { auth } from "./auth"

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return ""

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const api = createTRPCNext<RootRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
          /** headers are called on every request */
          headers: async () => {
            // Don't any additional header, if there is no logged in user.
            const { currentUser } = auth
            if (!currentUser) return {}

            // Send Auth header, if there is a logged in user.
            const token = await getIdToken(currentUser)
            return {
              Authorization: `Bearer ${token}`,
            }
          },
        }),
      ],
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       **/
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
})

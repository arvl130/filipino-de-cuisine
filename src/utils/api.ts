import { httpBatchLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"
import type { RootRouter } from "../server/trpc/routers/root"
import { getIdToken } from "firebase/auth"
import { auth } from "./auth"
import { getBaseUrl } from "./base-url"
import { SuperJsonWithDecimal } from "./transformer"

export const api = createTRPCNext<RootRouter>({
  config({ ctx }) {
    return {
      transformer: SuperJsonWithDecimal,
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

import { api } from "@/utils/api"
import { useSession } from "@/utils/auth"
import { useRouter } from "next/router"
import { ReactNode, useEffect } from "react"
import { LoadingSpinner } from "../loading"

export function SignInSignUpRedirector({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isLoading: isLoadingSession, isAuthenticated, user } = useSession()
  const {
    data: customerInfo,
    isLoading: isLoadingHasFilledIn,
    isError: isErrorHasFilledIn,
  } = api.customerInfo.get.useQuery(undefined, {
    enabled: user !== null,
  })

  useEffect(() => {
    if (!router.isReady) return
    if (isLoadingSession) return
    if (!isAuthenticated) return

    if (isLoadingHasFilledIn) return
    if (isErrorHasFilledIn) return

    const { returnUrl } = router.query
    if (typeof returnUrl === "string") {
      if (customerInfo) {
        router.push(returnUrl)
        return
      }

      router.push({
        pathname: "/account/fill-in-profile",
        query: {
          returnUrl,
        },
      })
      return
    }

    if (customerInfo) {
      router.push("/account")
      return
    }

    router.push({
      pathname: "/account/fill-in-profile",
      query: {
        returnUrl: "/account",
      },
    })
  }, [
    isLoadingSession,
    isAuthenticated,
    isLoadingHasFilledIn,
    isErrorHasFilledIn,
    customerInfo,
    router,
  ])

  if (isLoadingSession || isAuthenticated) return <LoadingSpinner />
  return <>{children}</>
}

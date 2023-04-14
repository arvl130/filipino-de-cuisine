import { api } from "@/utils/api"
import { useSession } from "@/utils/auth"
import { CustomerInfo } from "@prisma/client"
import { User } from "firebase/auth"
import { useRouter } from "next/router"
import { ReactNode, useEffect } from "react"

export function ProtectedPage({
  children,
}: {
  children: ({
    user,
    customerInfo,
  }: {
    user: User
    customerInfo: CustomerInfo
  }) => ReactNode
}) {
  const router = useRouter()
  const { isLoading: isLoadingSession, isAuthenticated, user } = useSession()
  const {
    data: customerInfo,
    isLoading: isLoadingCustomerInfo,
    isError: isErrorCustomerInfo,
  } = api.customerInfo.get.useQuery(undefined, {
    enabled: user !== null,
  })

  useEffect(() => {
    if (router.isReady && !isLoadingSession) {
      if (isAuthenticated) {
        if (!isLoadingCustomerInfo && !customerInfo)
          router.push("/account/fill-in-profile")
      } else {
        router.push("/signin")
      }
    }
  }, [
    router,
    isLoadingSession,
    isAuthenticated,
    isLoadingCustomerInfo,
    customerInfo,
  ])

  if (isLoadingSession) return <p>Loading ...</p>
  if (!isAuthenticated) return <></>
  if (!user)
    return (
      <p>Invalid state reached. Authenticated, but no session was found.</p>
    )

  if (isLoadingCustomerInfo) return <p>Loading ...</p>
  if (isErrorCustomerInfo)
    return <p>An error occured while retrieving profile.</p>
  if (!customerInfo) return <></>

  return <>{children({ user, customerInfo })}</>
}

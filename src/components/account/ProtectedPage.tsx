import { api } from "@/utils/api"
import { useSession } from "@/utils/auth"
import { CustomerInfo } from "@prisma/client"
import { User } from "firebase/auth"
import { useRouter } from "next/router"
import { ReactNode, useEffect } from "react"
import { LoadingSpinner } from "../loading"

export function IsAuthenticatedView({
  children,
}: {
  children: (user: User) => ReactNode
}) {
  const router = useRouter()
  const { isLoading, isAuthenticated, user } = useSession()

  useEffect(() => {
    if (router.isReady && !isLoading && !isAuthenticated) {
      router.push("/signin")
    }
  }, [router, isLoading, isAuthenticated])

  if (user === null) return <LoadingSpinner />

  return <>{children(user)}</>
}

function HasCustomerInfoView({
  children,
}: {
  user: User // This view requires the user to be present.
  children: (customerInfo: CustomerInfo) => ReactNode
}) {
  const router = useRouter()
  const { data, isLoading, isError } = api.customerInfo.get.useQuery()

  useEffect(() => {
    if (
      router.isReady &&
      !isLoading &&
      !isError &&
      (data === null || data === undefined)
    ) {
      router.push({
        pathname: "/account/fill-in-profile",
        query: {
          returnUrl: router.pathname,
        },
      })
    }
  }, [router, isLoading, isError, data])

  if (isLoading) return <LoadingSpinner />
  if (isError) return <p>An error occured while retrieving profile.</p>
  if (data === null || data === undefined) return <LoadingSpinner />

  return <>{children(data)}</>
}

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
  return (
    <IsAuthenticatedView>
      {(user) => (
        <HasCustomerInfoView user={user}>
          {(customerInfo) =>
            children({
              user,
              customerInfo,
            })
          }
        </HasCustomerInfoView>
      )}
    </IsAuthenticatedView>
  )
}

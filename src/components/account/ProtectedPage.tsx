import { api } from "@/utils/api"
import { useSession } from "@/utils/auth"
import { CustomerInfo } from "@prisma/client"
import { User } from "firebase/auth"
import { useRouter } from "next/router"
import { ReactNode, useEffect } from "react"
import { LoadingSpinner } from "../loading"
import Link from "next/link"

export function ProtectedSVGLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  const { isLoading: isLoadingSession, isAuthenticated } = useSession()
  const { isLoading: isLoadingCustomer, isError: isErrorCustomer } =
    api.customerInfo.get.useQuery(undefined, {
      enabled: !isLoadingSession && isAuthenticated,
    })

  if (isLoadingSession)
    return (
      <span className="text-emerald-300 transition duration-200">
        {children}
      </span>
    )

  if (!isAuthenticated)
    return (
      <Link href="/signin" className="text-emerald-500 transition duration-200">
        {children}
      </Link>
    )

  if (isLoadingCustomer)
    return (
      <span className="text-emerald-300 transition duration-200">
        {children}
      </span>
    )

  if (isErrorCustomer)
    return (
      <span className="text-red-500 transition duration-200">{children}</span>
    )

  return (
    <Link href={href} className="text-emerald-500 transition duration-200">
      {children}
    </Link>
  )
}

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

export function ComposedProtectedPage({
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
    isLoading: isLoadingCustomerInfo,
    isError: isErrorCustomerInfo,
    data: customerInfo,
  } = api.customerInfo.get.useQuery()

  useEffect(() => {
    if (!router.isReady) return
    if (isLoadingSession) return

    if (!isAuthenticated) {
      router.push("/signin")
      return
    }

    if (isLoadingCustomerInfo) return
    if (isErrorCustomerInfo) return
    if (customerInfo) return

    router.push({
      pathname: "/account/fill-in-profile",
      query: {
        returnUrl: router.pathname,
      },
    })
  }, [
    router,
    isLoadingSession,
    isAuthenticated,
    isLoadingCustomerInfo,
    isErrorCustomerInfo,
    customerInfo,
  ])

  if (isErrorCustomerInfo)
    return <p>An error occured while retrieving profile.</p>

  if (
    isLoadingSession ||
    user === null ||
    isLoadingCustomerInfo ||
    customerInfo === null
  )
    return <LoadingSpinner />

  return (
    <>
      {children({
        user,
        customerInfo,
      })}
    </>
  )
}

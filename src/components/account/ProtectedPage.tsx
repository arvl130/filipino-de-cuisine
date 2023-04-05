import { useSession } from "@/utils/auth"
import { User } from "firebase/auth"
import { useRouter } from "next/router"
import { ReactNode, useEffect } from "react"

export function ProtectedPage({
  children,
}: {
  children: (user: User) => ReactNode
}) {
  const router = useRouter()
  const { isLoading, isAuthenticated, user } = useSession()

  useEffect(() => {
    if (router.isReady && !isLoading && !isAuthenticated) router.push("/signin")
  }, [isLoading, isAuthenticated, router])

  if (isLoading) return <p>Loading ...</p>
  if (!isAuthenticated) return <></>
  if (!user)
    return (
      <p>Invalid state reached. Authenticated, but no session was found.</p>
    )

  return <>{children(user)}</>
}

import { useSession } from "@/utils/auth"
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function AccountsPage() {
  const router = useRouter()
  const { isLoading, isAuthenticated } = useSession()
  useEffect(() => {
    if (router.isReady && !isLoading && !isAuthenticated) router.push("/signin")
  }, [isLoading, isAuthenticated, router])
  if (isLoading) return <main>Loading ...</main>
  return (
    <main className="max-w-7xl mx-auto w-full px-6">
      <h2>Accounts Page</h2>
      <button
        type="button"
        onClick={async () => {
          const auth = getAuth()
          await signOut(auth)
          router.push("/signin")
        }}
      >
        Logout
      </button>
    </main>
  )
}

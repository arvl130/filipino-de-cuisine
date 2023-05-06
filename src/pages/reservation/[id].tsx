import { ProtectedPage } from "@/components/account/ProtectedPage"
import { LoadingSpinner } from "@/components/loading"
import { api } from "@/utils/api"
import { User } from "firebase/auth"
import { useRouter } from "next/router"

function AuthenticatedPage({}: { user: User }) {
  const { query, isReady } = useRouter()
  const { data, isLoading, isError } = api.reservation.getOne.useQuery(
    {
      id: parseInt(query.id as string),
    },
    {
      enabled: isReady && typeof query.id === "string",
    }
  )

  if (isLoading) return <LoadingSpinner />
  if (isError) return <div>An error occured</div>
  if (!data) return <div>No order found.</div>

  return <div>Hello, here is your reservation.</div>
}

export default function ViewOrderPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {({ user }) => <AuthenticatedPage user={user} />}
      </ProtectedPage>
    </main>
  )
}

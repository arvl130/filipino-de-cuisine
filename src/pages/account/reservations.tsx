import { AccountPageSwitcher } from "@/components/account/AccountPageSwitcher"
import { ProtectedPage } from "@/components/account/ProtectedPage"
import { User } from "firebase/auth"

function AuthenticatedPage({ user }: { user: User }) {
  return (
    <div className="grid grid-cols-[16rem_1fr]">
      <AccountPageSwitcher />
      <section>
        <h2 className="px-6 border-b border-stone-400 text-2xl font-semibold pb-3">
          Reservation History
        </h2>
      </section>
    </div>
  )
}

export default function ReservationsPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {(user) => <AuthenticatedPage user={user} />}
      </ProtectedPage>
    </main>
  )
}

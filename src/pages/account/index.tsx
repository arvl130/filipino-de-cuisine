import { AccountPageSwitcher } from "@/components/account/AccountPageSwitcher"
import { User } from "firebase/auth"
import { CustomerInfo } from "@prisma/client"
import { ProtectedPage } from "@/components/account/ProtectedPage"

function CustomerInfoSection({
  user,
  customerInfo,
}: {
  user: User
  customerInfo: CustomerInfo
}) {
  function formattedDate(givenDate: Date) {
    const year = givenDate.getFullYear()
    const month = givenDate.getMonth() + 1
    const date = givenDate.getDate()

    const monthStr = month < 10 ? `0${month}` : `${month}`
    const dateStr = date < 10 ? `0${date}` : `${date}`

    return `${year}-${monthStr}-${dateStr}`
  }

  return (
    <div className="px-6 py-6 grid sm:grid-cols-2 gap-y-6">
      <article>
        <h3 className="font-semibold">Name</h3>
        <p>{user.displayName}</p>
      </article>
      <article>
        <h3 className="font-semibold">Email</h3>
        <p>{user.email}</p>
      </article>
      <article>
        <h3 className="font-semibold">Contact Number</h3>
        <p>
          <>{customerInfo.defaultContactNumber}</>
        </p>
      </article>
      <article>
        <h3 className="font-semibold">Date of Birth</h3>
        <p>{formattedDate(customerInfo.dateOfBirth)}</p>
      </article>
      <article>
        <h3 className="font-semibold">Address</h3>
        <p>{customerInfo.defaultAddress}</p>
      </article>
    </div>
  )
}

function AuthenticatedPage({
  user,
  customerInfo,
}: {
  user: User
  customerInfo: CustomerInfo
}) {
  return (
    <div className="grid lg:grid-cols-[16rem_1fr] gap-3">
      <AccountPageSwitcher user={user} />
      <section>
        <h2 className="px-6 border-b border-stone-400 text-2xl font-semibold pb-3">
          My Account
        </h2>
        <CustomerInfoSection user={user} customerInfo={customerInfo} />
      </section>
    </div>
  )
}

export default function MyAccountPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {({ user, customerInfo }) => (
          <AuthenticatedPage user={user} customerInfo={customerInfo} />
        )}
      </ProtectedPage>
    </main>
  )
}

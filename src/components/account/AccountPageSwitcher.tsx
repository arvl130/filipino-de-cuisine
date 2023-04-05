import { User, getAuth, signOut } from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/router"

export function AccountPageSwitcher({ user }: { user: User }) {
  const { pathname } = useRouter()
  return (
    <aside>
      <p className="text-stone-500 pl-[calc(4px_+_0.5rem_+_1.5rem)] mb-6">
        Welcome back, <br />
        <span className="text-black font-medium">{user.displayName}</span>.
      </p>
      <ul className="grid gap-2">
        <li className="grid grid-cols-[4px_1fr] gap-2">
          {pathname === "/account/orders" ? (
            <>
              <div className="w-full bg-stone-400 h-full"></div>
              <Link
                href="/account/orders"
                className="bg-neutral-100 px-6 py-3 rounded-md hover:bg-neutral-200 font-medium transition duration-200"
              >
                Order Transactions
              </Link>
            </>
          ) : (
            <>
              <div></div>
              <Link
                href="/account/orders"
                className="px-6 py-3 rounded-md hover:bg-neutral-200 transition duration-200"
              >
                Order Transactions
              </Link>
            </>
          )}
        </li>
        <li className="grid grid-cols-[4px_1fr] gap-2">
          {pathname === "/account/reservations" ? (
            <>
              <div className="w-full bg-stone-400 h-full"></div>
              <Link
                href="/account/reservations"
                className="bg-neutral-100 px-6 py-3 rounded-md hover:bg-neutral-200 font-medium transition duration-200"
              >
                Reservation History
              </Link>
            </>
          ) : (
            <>
              <div></div>
              <Link
                href="/account/reservations"
                className="px-6 py-3 rounded-md hover:bg-neutral-200 transition duration-200"
              >
                Reservation History
              </Link>
            </>
          )}
        </li>
        <li className="grid grid-cols-[4px_1fr] gap-2">
          {pathname === "/account/settings" ? (
            <>
              <div className="w-full bg-stone-400 h-full"></div>
              <Link
                href="/account/settings"
                className="bg-neutral-100 px-6 py-3 rounded-md font-medium hover:bg-neutral-200 transition duration-200"
              >
                Account Settings
              </Link>
            </>
          ) : (
            <>
              <div></div>
              <Link
                href="/account/settings"
                className="px-6 py-3 rounded-md hover:bg-neutral-200 transition duration-200"
              >
                Account Settings
              </Link>
            </>
          )}
        </li>
        <li className="grid grid-cols-[4px_1fr] gap-2">
          <div></div>
          <button
            type="button"
            className="px-6 py-3 rounded-md hover:bg-neutral-200 text-left transition duration-200"
            onClick={() => {
              const auth = getAuth()
              signOut(auth)
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  )
}

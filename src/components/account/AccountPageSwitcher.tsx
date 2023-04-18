import { User, getAuth, signOut } from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"

function LogoutModal({ closeModal }: { closeModal: () => void }) {
  return (
    <div className="fixed inset-0 z-20 bg-black/20 flex justify-center items-center">
      <div className="bg-white max-w-xs w-full rounded-2xl px-8 py-6">
        <p className="text-center mb-3">Are you sure you want to logout?</p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="px-6 pt-2 pb-1 text-emerald-500 hover:bg-emerald-400 hover:border-emerald-400 hover:text-white transition duration-200 border-emerald-500 border rounded-md font-medium"
            onClick={() => closeModal()}
          >
            No
          </button>
          <button
            type="button"
            className="px-6 pt-2 pb-1 bg-red-500 hover:bg-red-400 transition duration-200 text-white rounded-md font-medium"
            onClick={() => {
              const auth = getAuth()
              signOut(auth)
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}

export function AccountPageSwitcher({ user }: { user: User }) {
  const { pathname } = useRouter()
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false)

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
            onClick={() => setIsLogoutModalVisible(true)}
          >
            Logout
          </button>
          {isLogoutModalVisible && (
            <LogoutModal
              closeModal={() => {
                setIsLogoutModalVisible(false)
              }}
            />
          )}
        </li>
      </ul>
    </aside>
  )
}

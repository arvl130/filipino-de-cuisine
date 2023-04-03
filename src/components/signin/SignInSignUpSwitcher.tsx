import Link from "next/link"
import { useRouter } from "next/router"

export function SignInSignUpSwitcher() {
  const { pathname } = useRouter()

  return (
    <div className="bg-neutral-100 rounded-md text-center inline-flex">
      <Link
        href="/signin"
        className={`px-6 py-2 ${
          pathname === "/signin"
            ? "bg-red-600 text-white font-bold rounded-md"
            : ""
        }`}
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className={`px-6 py-2 ${
          pathname === "/signup"
            ? "bg-red-600 text-white font-bold rounded-md"
            : ""
        }`}
      >
        Sign Up
      </Link>
    </div>
  )
}

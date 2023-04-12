import { useRouter } from "next/router"

export function SignInSignUpSwitcher() {
  const { pathname, query, push } = useRouter()

  return (
    <div className="bg-neutral-100 rounded-md text-center inline-flex">
      {/* This should have been a link, but we have to persist the returnUrl
          when clicking this link, so we have to use a button instead.
          
          We put role="link" in here to tell accessibility readers that this
          is actually a link.
       */}
      <button
        role="link"
        type="button"
        onClick={() => {
          if (typeof query.returnUrl === "string") {
            push({
              pathname: "/signin",
              query: {
                returnUrl: query.returnUrl,
              },
            })
            return
          }

          push("/signin")
        }}
        className={`px-6 py-2 ${
          pathname === "/signin"
            ? "bg-red-600 text-white font-bold rounded-md"
            : ""
        }`}
      >
        Sign In
      </button>
      <button
        role="link"
        type="button"
        onClick={() => {
          if (typeof query.returnUrl === "string") {
            push({
              pathname: "/signup",
              query: {
                returnUrl: query.returnUrl,
              },
            })
            return
          }

          push("/signup")
        }}
        className={`px-6 py-2 ${
          pathname === "/signup"
            ? "bg-red-600 text-white font-bold rounded-md"
            : ""
        }`}
      >
        Sign Up
      </button>
    </div>
  )
}

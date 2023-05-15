import { useSession } from "@/utils/auth"
import { getAuth } from "firebase/auth"
import { sendPasswordResetEmail } from "firebase/auth"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("")
  const { isLoading, isAuthenticated } = useSession()

  const router = useRouter()
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/signin")
    }
  }, [isLoading, isAuthenticated, router])

  return (
    <main className="max-w-md mx-auto py-12 px-6">
      <form
        action=""
        className=" grid"
        onSubmit={async (e) => {
          e.preventDefault()
          try {
            const auth = getAuth()
            await sendPasswordResetEmail(auth, email)
            alert("Your password reset link has been sent.")
          } catch (e) {
            console.log("error while sending email", e)
          }
        }}
      >
        <p>Enter the email you used to create your password:</p>
        <input
          type="text"
          className="border border-gray-300 rounded-md mb-3 px-4 py-2"
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <button
          type="submit"
          className="bg-emerald-500 px-4 py-2 text-white rounded-full"
        >
          Send Password Reset Link
        </button>
      </form>
    </main>
  )
}

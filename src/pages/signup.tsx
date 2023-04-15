import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { useState } from "react"
import { SignInSignUpSwitcher } from "@/components/signin/SignInSignUpSwitcher"
import { SignInSignUpRedirector } from "@/components/signin/SignInSignUpRedirector"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type formType = z.infer<typeof formSchema>

function CreateAccountWithEmailForm({ email }: { email: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
    },
  })
  const [isSigningUp, setIsSigningUp] = useState(false)

  return (
    <form
      onSubmit={handleSubmit(async (formData) => {
        try {
          setIsSigningUp(true)

          const auth = getAuth()
          await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          )
        } catch (e) {
          if (e instanceof FirebaseError) {
            if (e.code === "auth/email-already-in-use") {
              console.log("Email is already in use:", e)
            } else {
              console.log("Unhandled Firebase error:", e)
            }
          } else {
            console.log("Unhandled error:", e)
          }
        } finally {
          setIsSigningUp(false)
        }
      })}
    >
      <label>Password</label>
      <input
        type="password"
        className="bg-neutral-100 rounded-md px-4 py-2 w-full mb-3"
        {...register("password")}
      />
      <button
        type="button"
        disabled={isSigningUp}
        className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 mb-1 text-lg text-white font-semibold w-full py-2 rounded-md"
      >
        {isSigningUp ? <>Signing up ...</> : <>Sign Up</>}
      </button>
    </form>
  )
}

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  return (
    <main className="max-w-6xl mx-auto my-12 w-full px-6">
      <SignInSignUpRedirector>
        <div className="flex justify-center">
          <SignInSignUpSwitcher />
        </div>
        <div className="[box-shadow:_0px_1px_4px_1px_rgba(0,_0,_0,_0.25)] rounded-2xl shadow-md px-8 py-6 max-w-2xl my-12 mx-auto grid grid-cols-[1fr_14rem]">
          <div>
            <h2 className="font-semibold text-xl text-center mb-3">Sign Up</h2>
            {isPasswordFormVisible ? (
              <CreateAccountWithEmailForm email={email} />
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setIsPasswordFormVisible(true)
                }}
              >
                <label>Email</label>
                <input
                  type="email"
                  className="bg-neutral-100 rounded-md px-4 py-2 w-full mb-3"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 mb-1 text-lg text-white font-semibold w-full py-2 rounded-md"
                >
                  Continue
                </button>
              </form>
            )}
            <div className="flex justify-center items-center my-6">
              <div className="h-0.5 w-24 bg-stone-200"></div>
              <div className="px-3">OR</div>
              <div className="h-0.5 w-24 bg-stone-200"></div>
            </div>
            <div>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-500 transition duration-200  rounded-full text-white font-semibold w-full py-2 mb-3"
              >
                Sign In with Facebook
              </button>
              <button
                type="button"
                disabled={isSigningIn}
                className="bg-red-600 hover:bg-red-500 disabled:bg-red-400 transition duration-200 rounded-full text-white font-semibold w-full py-2"
                onClick={async () => {
                  try {
                    setIsSigningIn(true)

                    const auth = getAuth()
                    const provider = new GoogleAuthProvider()

                    await signInWithPopup(auth, provider)
                  } catch (e) {
                    setIsSigningIn(false)
                    console.log("Unhandled error:", e)
                  }
                }}
              >
                {isSigningIn ? <>Signing in ...</> : <>Sign In with Google</>}
              </button>
            </div>
          </div>
          <div className="pl-8">
            <Image
              src="/assets/signin/side-banner.jpg"
              alt="side banner"
              height={210}
              width={140}
              className="h-full w-full rounded-2xl object-cover scale-y-125"
            />
          </div>
        </div>
      </SignInSignUpRedirector>
    </main>
  )
}

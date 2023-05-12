import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  signInWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth"
import { useState } from "react"
import { SignInSignUpSwitcher } from "@/components/signin/SignInSignUpSwitcher"
import { SignInSignUpRedirector } from "@/components/signin/SignInSignUpRedirector"
import { FirebaseError } from "firebase/app"

function ErrorModal({
  title,
  message,
  closeModal,
}: {
  title: string
  message: string
  closeModal: () => void
}) {
  return (
    <div className="fixed inset-0 z-20 bg-black/20 flex justify-center items-center">
      <div className="bg-white max-w-xs w-full rounded-2xl px-8 py-6">
        <p className="text-center mb-1 font-semibold">{title}</p>
        <p className="text-center mb-3">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="px-6 pt-2 pb-1 text-emerald-500 hover:bg-emerald-400 hover:border-emerald-400 hover:text-white transition duration-200 border-emerald-500 border rounded-md font-medium"
            onClick={() => closeModal()}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(8, {
      message: "Your password should be at least 8 characters long",
    }),
})

type formType = z.infer<typeof formSchema>

export default function SignInPage() {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
  })
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [errorTitle, setErrorTitle] = useState("")

  return (
    <main className="max-w-6xl mx-auto my-12 w-full px-6">
      <SignInSignUpRedirector>
        <div className="flex justify-center">
          <SignInSignUpSwitcher />
        </div>
        <div className="[box-shadow:_0px_1px_4px_1px_rgba(0,_0,_0,_0.25)] rounded-2xl shadow-md px-8 py-6 max-w-2xl my-12 mx-auto grid grid-cols-[1fr_14rem]">
          <div>
            <h2 className="font-semibold text-xl text-center">Sign In</h2>
            <form
              onSubmit={handleSubmit(async (formData) => {
                try {
                  setIsSigningIn(true)

                  const auth = getAuth()
                  await signInWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                  )
                } catch (e) {
                  if (e instanceof FirebaseError) {
                    if (
                      e.code === "auth/wrong-password" ||
                      e.code === "auth/user-not-found"
                    ) {
                      setErrorTitle("Invalid email or password")
                      setErrorMessage(
                        "The email or password you have entered is incorrect. Please try again."
                      )
                      reset((originalValues) => ({
                        email: originalValues.email,
                        password: "",
                      }))
                      setIsErrorModalVisible(true)
                      return
                    }

                    setErrorTitle("Unknown Firebase error occured")
                    setErrorMessage(
                      "An unknown error with Firebase occured. Please check the Console for more information."
                    )
                    reset((originalValues) => ({
                      email: originalValues.email,
                      password: "",
                    }))
                    setIsErrorModalVisible(true)
                    console.log("Firebase error occured:", e)
                    return
                  }

                  setErrorTitle("Unknown error occured")
                  setErrorMessage(
                    "An unknown error occured. Please check the Console for more information."
                  )
                  reset((originalValues) => ({
                    email: originalValues.email,
                    password: "",
                  }))
                  setIsErrorModalVisible(true)
                  console.log("Unknown error occured:", e)
                } finally {
                  setIsSigningIn(false)
                }
              })}
            >
              <div className="flex flex-col mb-3">
                <label htmlFor="" className="font-medium">
                  Email
                </label>
                <input
                  type="email"
                  className="bg-neutral-100 rounded-md px-4 py-2"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-600 mt-1">{errors.email.message}.</p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Password
                </label>
                <input
                  type="password"
                  className="bg-neutral-100 rounded-md px-4 py-2 mb-1"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-600 mt-1">
                    {errors.password.message}.
                  </p>
                )}
              </div>
              <p className="mb-3 text-right">
                <Link href="/" className="text-stone-500 text-sm">
                  Forgot Password?
                </Link>
              </p>
              <button
                type="submit"
                disabled={isSigningIn}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 text-white font-semibold w-full py-2 rounded-md text-lg"
              >
                {isSigningIn ? <>Signing in ...</> : <>Sign In</>}
              </button>
            </form>
            <div className="flex justify-center items-center my-6">
              <div className="w-24 h-[1px] bg-stone-500"></div>
              <div className="px-3">OR</div>
              <div className="w-24 h-[1px] bg-stone-500"></div>
            </div>
            <form className="mb-3">
              <button
                type="button"
                disabled={isSigningIn}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 transition duration-200  rounded-full text-white font-semibold w-full py-2 mb-3"
                onClick={async () => {
                  try {
                    setIsSigningIn(true)

                    const auth = getAuth()
                    const provider = new FacebookAuthProvider()

                    await signInWithPopup(auth, provider)
                  } catch (e) {
                    setIsSigningIn(false)
                    console.log("Unhandled error:", e)
                  }
                }}
              >
                {isSigningIn ? <>Signing in ...</> : <>Sign In with Facebook</>}
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
            </form>
            <p className="text-stone-500 text-center">
              <span className="italic">Don&apos;t have an account?</span>{" "}
              <Link href="/signup" className="font-semibold text-emerald-500">
                Sign Up
              </Link>
            </p>
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
        {isErrorModalVisible && (
          <ErrorModal
            closeModal={() => setIsErrorModalVisible(false)}
            message={errorMessage}
            title={errorTitle}
          />
        )}
      </SignInSignUpRedirector>
    </main>
  )
}

import { SignInSignUpSwitcher } from "@/components/signin/SignInSignUpSwitcher"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"
import { useRouter } from "next/router"
import { useState } from "react"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type formType = z.infer<typeof formSchema>

export default function SignInPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
  })
  const [isSigningIn, setIsSigningIn] = useState(false)

  return (
    <main className="max-w-6xl mx-auto my-12 w-full px-6">
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
                router.push("/account")
              } catch (e) {
                console.log("Generic error occured:", e)
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
                <p className="text-red-600 mt-1">{errors.password.message}.</p>
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
              type="submit"
              className="w-full [background-color:_#3b5998] text-white font-semibold py-2 rounded-full mb-3"
            >
              Sign In with Facebook
            </button>
            <button
              type="submit"
              className="w-full [background-color:_#ea4335] text-white font-semibold py-2 rounded-full"
            >
              Sign In with Google
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
    </main>
  )
}

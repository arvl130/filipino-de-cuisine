import { SignInSignUpSwitcher } from "@/components/signin/SignInSignUpSwitcher"
import Image from "next/image"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { useRouter } from "next/router"

const VALID_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const VALID_CONTACT_NUMBER = /^09\d{9}$/

const formSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    dateOfBirth: z.string().regex(VALID_DATE_REGEX, {
      message: "Invalid date",
    }),
    defaultContactNumber: z.string().regex(VALID_CONTACT_NUMBER, {
      message: "Invalid contact number",
    }),
    defaultAddress: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      })
    }
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
  const { mutateAsync: updateCustomerInfo } =
    api.customerInfo.update.useMutation()
  return (
    <main className="max-w-6xl mx-auto my-12 w-full px-6">
      <div className="flex justify-center">
        <SignInSignUpSwitcher />
      </div>
      <div className="[box-shadow:_0px_1px_4px_1px_rgba(0,_0,_0,_0.25)] rounded-2xl shadow-md px-8 py-6 max-w-2xl my-12 mx-auto grid grid-cols-[1fr_14rem]">
        <div>
          <h2 className="font-semibold text-xl text-center">Sign Up</h2>
          <form
            onSubmit={handleSubmit(async (formData) => {
              try {
                console.log("formData", formData)
                const auth = getAuth()
                await createUserWithEmailAndPassword(
                  auth,
                  formData.email,
                  formData.password
                )
                await updateCustomerInfo({
                  dateOfBirth: formData.dateOfBirth,
                  defaultAddress: formData.defaultAddress,
                  defaultContactNumber: formData.defaultContactNumber,
                })
                router.push("/signin")
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
              }
            })}
          >
            <div className="flex flex-col mb-3">
              <label htmlFor="" className="font-medium">
                Email
              </label>
              <input
                type="email"
                className="bg-neutral-100 rounded-md px-2 py-1 w-full"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 mt-1">{errors.email.message}.</p>
              )}
            </div>
            <div className="flex flex-col mb-3">
              <label htmlFor="" className="font-medium">
                Name
              </label>
              <input
                type="text"
                className="bg-neutral-100 rounded-md px-2 py-1 w-full"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-600 mt-1">{errors.name.message}.</p>
              )}
              <p className="text-stone-500 text-sm mt-1">
                Your name cannot be changed later.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="bg-neutral-100 rounded-md px-2 py-1 w-full"
                  {...register("dateOfBirth")}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-600 mt-1">
                    {errors.dateOfBirth.message}.
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="bg-neutral-100 rounded-md px-2 py-1 w-full"
                  {...register("defaultContactNumber")}
                />
                {errors.defaultContactNumber && (
                  <p className="text-red-600 mt-1">
                    {errors.defaultContactNumber.message}.
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col mb-3">
              <label htmlFor="" className="font-medium">
                Address
              </label>
              <input
                type="text"
                className="bg-neutral-100 rounded-md px-2 py-1 w-full"
                {...register("defaultAddress")}
              />
              {errors.defaultAddress && (
                <p className="text-red-600 mt-1">
                  {errors.defaultAddress.message}.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-3 mb-1">
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Password
                </label>
                <input
                  type="password"
                  className="bg-neutral-100 rounded-md px-2 py-1 w-full"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-600 mt-1">
                    {errors.password.message}.
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="bg-neutral-100 rounded-md px-2 py-1 w-full"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 mt-1">
                    {errors.confirmPassword.message}.
                  </p>
                )}
              </div>
            </div>
            <p className="text-stone-500 text-sm">
              Password must be at least 8 characters.
            </p>
            <p className="mb-6 text-right"></p>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 transition duration-200 mb-1 text-lg text-white font-semibold w-full py-2 rounded-md"
            >
              Sign Up
            </button>
            <p className="text-sm text-stone-500">
              By signing up, you agree to the{" "}
              <Link
                href="/terms-and-condition"
                className="text-emerald-500 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and have read the{" "}
              <Link href="/privacy" className="text-emerald-500 font-medium">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
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

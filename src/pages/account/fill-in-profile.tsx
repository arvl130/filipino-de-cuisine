import Image from "next/image"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { User, signOut } from "firebase/auth"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import { LoadingSpinner } from "@/components/loading"
import { useSession } from "@/utils/auth"
import {
  VALID_CONTACT_NUMBER,
  VALID_DATE_REGEX,
} from "@/utils/validation-patterns"

function ProtectedPage({ children }: { children: (user: User) => ReactNode }) {
  const router = useRouter()
  const { isLoading: isLoadingSession, isAuthenticated, user } = useSession()
  const {
    isLoading: isLoadingCustomerInfo,
    isError: isErrorCustomerInfo,
    data: customerInfo,
  } = api.customerInfo.get.useQuery(undefined, {
    enabled: user !== null,
  })

  useEffect(() => {
    if (!router.isReady) return
    if (isLoadingSession) return
    if (!isAuthenticated) {
      router.push("/signin")
      return
    }

    if (isLoadingCustomerInfo) return
    if (isErrorCustomerInfo) return
    if (!customerInfo) return

    const { returnUrl } = router.query
    if (typeof returnUrl === "string") {
      router.push({
        pathname: returnUrl,
      })
      return
    }
    router.push("/account")
  }, [
    router,
    isLoadingSession,
    isAuthenticated,
    isLoadingCustomerInfo,
    isErrorCustomerInfo,
    customerInfo,
  ])

  if (isErrorCustomerInfo)
    return <p>An error occured while loading your profile.</p>

  if (
    isLoadingSession ||
    user === null ||
    isLoadingCustomerInfo ||
    customerInfo !== null
  )
    return <LoadingSpinner />

  return <>{children(user)}</>
}

const formSchema = z.object({
  name: z.string().min(1),
  dateOfBirth: z.string().regex(VALID_DATE_REGEX, {
    message: "Invalid date",
  }),
  defaultContactNumber: z.string().regex(VALID_CONTACT_NUMBER, {
    message: "Invalid contact number",
  }),
  defaultAddress: z.string().min(1),
})

type formType = z.infer<typeof formSchema>

function AuthenticatedPage({ user }: { user: User }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  })

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  const apiContext = api.useContext()
  const { mutate: updateCustomerInfo } = api.customerInfo.update.useMutation({
    onSuccess: async () => {
      // Invalidate profile cache if it is available.
      await user.reload()
      await apiContext.customerInfo.get.invalidate()
    },
    onError: () => setIsUpdatingProfile(false),
  })

  return (
    <div className="[box-shadow:_0px_1px_4px_1px_rgba(0,_0,_0,_0.25)] rounded-2xl shadow-md px-8 py-6 max-w-2xl mx-auto grid grid-cols-[1fr_14rem]">
      <div>
        <h2 className="font-semibold text-xl text-center mb-3">
          Fill In Information
        </h2>
        <form
          onSubmit={handleSubmit(
            async ({
              name,
              dateOfBirth,
              defaultAddress,
              defaultContactNumber,
            }) => {
              setIsUpdatingProfile(true)
              updateCustomerInfo({
                displayName: name,
                dateOfBirth,
                defaultAddress,
                defaultContactNumber,
              })
            }
          )}
        >
          <div className="flex flex-col mb-3">
            <label htmlFor="" className="font-medium">
              Name
            </label>
            <input
              type="text"
              className="bg-neutral-100 rounded-md px-4 py-2 w-full"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-600 mt-1">{errors.name.message}.</p>
            )}
            <p className="text-stone-500 text-sm mt-1">
              This cannot be changed later.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex flex-col">
              <label htmlFor="" className="font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                className="bg-neutral-100 rounded-md px-4 py-2 w-full"
                {...register("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="text-red-600 mt-1">
                  {errors.dateOfBirth.message}.
                </p>
              )}
              <p className="text-stone-500 text-sm mt-1">
                This cannot be changed later.
              </p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="" className="font-medium">
                Contact Number
              </label>
              <input
                type="text"
                placeholder="09XXYYYZZZZ"
                className="bg-neutral-100 rounded-md px-4 py-2 w-full"
                {...register("defaultContactNumber")}
                onChange={(e) => {
                  const { value } = e.target
                  e.target.value = value
                    .replace(/[^0-9]+/g, "")
                    .substring(0, 11)
                }}
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
              className="bg-neutral-100 rounded-md px-4 py-2 w-full"
              {...register("defaultAddress")}
            />
            {errors.defaultAddress && (
              <p className="text-red-600 mt-1">
                {errors.defaultAddress.message}.
              </p>
            )}
            <p className="text-stone-500 text-sm mt-1">
              Orders can only be delivered to addresses in Quezon City.
            </p>
          </div>
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 mb-2 text-lg text-white font-semibold w-full py-2 rounded-md"
          >
            {isUpdatingProfile ? <>Saving ...</> : <>Save</>}
          </button>
          <button
            type="button"
            className="bg-neutral-200 hover:bg-neutral-300 hover:text-neutral-600 disabled:bg-emerald-300 transition duration-200 mb-1 text-lg text-neutral-500 font-semibold w-full py-2 rounded-md"
            onClick={() => {
              const auth = getAuth()
              signOut(auth)
            }}
          >
            Logout
          </button>
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
  )
}

export default function SignInPage() {
  return (
    <main className="max-w-6xl mx-auto pt-16 w-full px-6">
      <ProtectedPage>
        {(user) => <AuthenticatedPage user={user} />}
      </ProtectedPage>
    </main>
  )
}

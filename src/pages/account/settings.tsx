import { AccountPageSwitcher } from "@/components/account/AccountPageSwitcher"
import { ProtectedPage } from "@/components/account/ProtectedPage"
import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { CustomerInfo } from "@prisma/client"
import {
  User,
  getAuth,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const VALID_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const VALID_CONTACT_NUMBER = /^09\d{9}$/

const editInformationFormSchema = z.object({
  displayName: z.string().min(1),
  dateOfBirth: z.string().regex(VALID_DATE_REGEX, {
    message: "Invalid date",
  }),
  defaultAddress: z.string().min(1),
  defaultContactNumber: z.string().regex(VALID_CONTACT_NUMBER, {
    message: "Invalid contact number",
  }),
})

type EditInformationFormType = z.infer<typeof editInformationFormSchema>

function EditInformationForm({
  defaultValues,
  reloadUser,
}: {
  defaultValues: EditInformationFormType
  reloadUser: () => Promise<void>
}) {
  const { refetch } = api.customerInfo.get.useQuery()
  const { mutate: updateCustomerInfo, isLoading } =
    api.customerInfo.update.useMutation({
      onSuccess: async () => {
        await reloadUser()
        refetch()
      },
    })

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
  } = useForm<EditInformationFormType>({
    resolver: zodResolver(editInformationFormSchema),
    defaultValues,
  })

  return (
    <form
      className="rounded-2xl border border-neutral-300 grid px-6 pt-4 pb-6"
      onSubmit={handleSubmit((formData) => updateCustomerInfo(formData))}
    >
      <label className="font-semibold">Contact number</label>
      <input
        type="text"
        className="bg-neutral-100 rounded-md px-4 py-2 mb-3"
        {...register("defaultContactNumber")}
      />
      <label className="font-semibold">Address</label>
      <input
        type="text"
        className="bg-neutral-100 rounded-md px-4 py-2 mb-3"
        {...register("defaultAddress")}
      />
      <button
        type="submit"
        disabled={isLoading || !isDirty}
        className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 text-white font-semibold w-full py-2 rounded-md text-lg"
      >
        {isLoading ? <>Saving ...</> : <>Save</>}
      </button>
    </form>
  )
}

const editEmailFormSchema = z.object({
  newEmail: z.string().email(),
  password: z.string().min(8),
})

type EditEmailFormType = z.infer<typeof editEmailFormSchema>

function EditEmailForm({
  defaultValues,
}: {
  defaultValues: EditEmailFormType
}) {
  const {
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<EditEmailFormType>({
    resolver: zodResolver(editEmailFormSchema),
    defaultValues,
  })
  const [isLoading, setIsLoading] = useState(false)

  return (
    <form
      className="rounded-2xl border border-neutral-300 grid px-6 pt-4 pb-6"
      onSubmit={handleSubmit(async (formData) => {
        setIsLoading(true)
        try {
          const auth = getAuth()
          const userCredential = await signInWithEmailAndPassword(
            auth,
            defaultValues.newEmail,
            formData.password
          )
          await updateEmail(userCredential.user, formData.newEmail)
        } catch (e) {
          console.log("Unknown error occured:", e)
        } finally {
          setIsLoading(false)
        }
      })}
    >
      <label className="font-semibold">Email</label>
      <input
        type="email"
        className="bg-neutral-100 disabled:bg-neutral-300 rounded-md px-4 py-2 mb-3"
        {...register("newEmail")}
      />

      <label className="font-semibold">Password</label>
      <input
        type="password"
        className="bg-neutral-100 disabled:bg-neutral-300 rounded-md px-4 py-2 mb-3"
        {...register("password")}
      />

      <button
        type="submit"
        disabled={isLoading || !isValid}
        className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 text-white font-semibold w-full py-2 rounded-md text-lg"
      >
        {isLoading ? <>Updating ...</> : <>Update</>}
      </button>
    </form>
  )
}

const editPasswordFormSchema = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
  confirmNewPassword: z.string().min(8),
})

type EditPasswordFormType = z.infer<typeof editPasswordFormSchema>

function EditPasswordForm({ email }: { email: string }) {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<EditPasswordFormType>({
    resolver: zodResolver(editPasswordFormSchema),
  })
  const [isLoading, setIsLoading] = useState(false)

  return (
    <form
      className="rounded-2xl border border-neutral-300 grid px-6 pt-4 pb-6"
      onSubmit={handleSubmit(async (formData) => {
        setIsLoading(true)
        try {
          const auth = getAuth()
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            formData.password
          )
          await updatePassword(userCredential.user, formData.newPassword)
        } catch (e) {
          console.log("Unknown error occured:", e)
        } finally {
          setIsLoading(false)
        }
      })}
    >
      <label className="font-semibold">Password</label>
      <input
        type="email"
        className="bg-neutral-100 disabled:bg-neutral-300 rounded-md px-4 py-2 mb-3"
        {...register("password")}
      />

      <label className="font-semibold">New Password</label>
      <input
        type="password"
        className="bg-neutral-100 disabled:bg-neutral-300 rounded-md px-4 py-2 mb-3"
        {...register("newPassword")}
      />

      <label className="font-semibold">Confirm New Password</label>
      <input
        type="password"
        className="bg-neutral-100 disabled:bg-neutral-300 rounded-md px-4 py-2 mb-3"
        {...register("confirmNewPassword")}
      />

      <button
        type="submit"
        disabled={isLoading || !isValid}
        className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 text-white font-semibold w-full py-2 rounded-md text-lg"
      >
        {isLoading ? <>Updating ...</> : <>Update</>}
      </button>
    </form>
  )
}

function AuthenticatedPage({
  user,
  customerInfo,
}: {
  user: User
  customerInfo: CustomerInfo
}) {
  function formattedDate(givenDate: Date) {
    const year = givenDate.getFullYear()
    const month = givenDate.getMonth() + 1
    const date = givenDate.getDate()

    const monthStr = month < 10 ? `0${month}` : `${month}`
    const dateStr = date < 10 ? `0${date}` : `${date}`

    return `${year}-${monthStr}-${dateStr}`
  }

  const providerId = user.providerData[0].providerId

  return (
    <div className="grid grid-cols-[16rem_1fr] gap-3">
      <AccountPageSwitcher user={user} />
      <section>
        <h2 className="px-6 border-b border-stone-400 text-2xl font-semibold pb-3 mb-6">
          Account Settings
        </h2>
        <div className="[box-shadow:_0px_2px_4px_2px_rgba(0,_0,_0,_0.25);] rounded-2xl px-8 py-6 max-w-3xl mx-auto grid grid-cols-2 gap-6 mb-3">
          <article>
            <h3 className="font-semibold mb-1">Edit Information</h3>
            <EditInformationForm
              defaultValues={{
                displayName: user.displayName ?? "N/A",
                dateOfBirth: formattedDate(customerInfo.dateOfBirth),
                defaultAddress: customerInfo.defaultAddress,
                defaultContactNumber: customerInfo.defaultContactNumber,
              }}
              reloadUser={async () => {
                await user.reload()
              }}
            />
          </article>
          {providerId === "password" && (
            <article>
              <div className="mb-6">
                <h3 className="font-semibold mb-1">Edit Email</h3>
                <EditEmailForm
                  defaultValues={{
                    newEmail: user.email ?? "N/A",
                    password: "",
                  }}
                />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Edit Password</h3>
                <EditPasswordForm email={user.email ?? ""} />
              </div>
            </article>
          )}
        </div>
      </section>
    </div>
  )
}

export default function AccountSettingsPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {({ user, customerInfo }) => (
          <AuthenticatedPage user={user} customerInfo={customerInfo} />
        )}
      </ProtectedPage>
    </main>
  )
}

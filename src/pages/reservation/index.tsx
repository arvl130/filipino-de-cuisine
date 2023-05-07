import { ProtectedPage } from "@/components/account/ProtectedPage"
import { useReservationDetailsStore } from "@/stores/reservationDetails"
import {
  VALID_CONTACT_NUMBER,
  VALID_DATE_REGEX,
} from "@/utils/validation-patterns"
import { zodResolver } from "@hookform/resolvers/zod"
import { CustomerInfo } from "@prisma/client"
import { User } from "firebase/auth"
import { DateTime } from "luxon"
import Image from "next/image"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { z } from "zod"

const reservationDateFormSchema = z.object({
  name: z.string(),
  contactNumber: z.string().regex(VALID_CONTACT_NUMBER, {
    message: "Invalid contact number",
  }),
  reservationDate: z.string().regex(VALID_DATE_REGEX, {
    message: "Invalid date",
  }),
  additionalNotes: z.string(),
  paymentMethod: z.union([z.literal("MAYA"), z.literal("GCASH")]),
})

type ReservationDateFormType = z.infer<typeof reservationDateFormSchema>

function formattedDate(givenDate: Date) {
  const year = givenDate.getFullYear()
  const month = givenDate.getMonth() + 1
  const date = givenDate.getDate()

  const monthStr = month < 10 ? `0${month}` : `${month}`
  const dateStr = date < 10 ? `0${date}` : `${date}`

  return `${year}-${monthStr}-${dateStr}`
}

function AuthenticatedPage({
  user,
  customerInfo,
}: {
  user: User
  customerInfo: CustomerInfo
}) {
  const tomorrowDateTime = DateTime.now().setZone("Asia/Manila").plus({
    day: 1,
  })
  const tomorrowFormattedDate = formattedDate(tomorrowDateTime.toJSDate())

  const router = useRouter()
  const {
    setCustomerName,
    setContactNumber,
    setReservationDate,
    setAdditionalNotes,
    setPaymentMethod,
  } = useReservationDetailsStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservationDateFormType>({
    resolver: zodResolver(reservationDateFormSchema),
    defaultValues: {
      name: user.displayName ?? "",
      contactNumber: customerInfo.defaultContactNumber,
      reservationDate: tomorrowFormattedDate,
      additionalNotes: "",
    },
  })

  return (
    <div className="[box-shadow:_0px_1px_4px_1px_rgba(0,_0,_0,_0.25)] rounded-2xl shadow-md px-8 py-6 max-w-4xl mx-auto grid grid-cols-[16rem_1fr] gap-8">
      <div>
        <Image
          src="/assets/reservation/side-bg.webp"
          alt="side banner"
          height={256}
          width={512}
          className="h-full w-full rounded-2xl object-cover object-right-bottom scale-y-125"
        />
      </div>
      <form
        onSubmit={handleSubmit(
          ({
            name,
            contactNumber,
            reservationDate,
            additionalNotes,
            paymentMethod,
          }) => {
            setCustomerName(name)
            setContactNumber(contactNumber)
            setReservationDate(reservationDate)
            setAdditionalNotes(additionalNotes)
            setPaymentMethod(paymentMethod)
            router.push("/reservation/choose-slot")
          }
        )}
      >
        <div className="grid grid-cols-2 gap-6 mb-3">
          <div className="flex flex-col">
            <label htmlFor="" className="font-medium">
              Name
            </label>
            <input
              type="text"
              className="bg-neutral-100 rounded-md px-4 py-2 mb-1"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-600 mt-1">{errors.name.message}.</p>
            )}
          </div>
          <div>
            <label htmlFor="" className="font-medium">
              Contact Number
            </label>
            <input
              type="text"
              className="bg-neutral-100 rounded-md px-4 py-2 mb-1"
              {...register("contactNumber")}
              onChange={(e) => {
                const { value } = e.target
                e.target.value = value.replace(/[^0-9]+/g, "").substring(0, 11)
              }}
            />
            {errors.contactNumber && (
              <p className="text-red-600 mt-1">
                {errors.contactNumber.message}.
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-3">
          <div className="flex flex-col">
            <label htmlFor="" className="font-medium">
              Reservation Date
            </label>
            <input
              type="date"
              min={tomorrowFormattedDate}
              className="bg-neutral-100 rounded-md px-4 py-2 mb-1"
              {...register("reservationDate")}
            />
            {errors.reservationDate && (
              <p className="text-red-600 mt-1">
                {errors.reservationDate.message}.
              </p>
            )}
          </div>
          <div></div>
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="" className="font-medium">
            Additional Notes
          </label>
          <input
            type="text"
            className="bg-neutral-100 rounded-md px-4 py-2 mb-1"
            {...register("additionalNotes")}
          />
          {errors.additionalNotes && (
            <p className="text-red-600 mt-1">
              {errors.additionalNotes.message}.
            </p>
          )}
        </div>
        <div className="mb-3">
          <p className="font-medium">Reservation Fee</p>
          <div className="flex gap-6">
            <label>
              <input
                type="radio"
                className="bg-neutral-100 rounded-md px-4 py-2 mb-1"
                {...register("paymentMethod")}
                value="MAYA"
              />
              <span className="ml-2">Maya</span>
            </label>
            <label>
              <input
                type="radio"
                className="bg-neutral-100 rounded-md px-4 py-2 mb-1"
                {...register("paymentMethod")}
                value="GCASH"
              />
              <span className="ml-2">GCash</span>
            </label>
          </div>
          {errors.paymentMethod && (
            <p className="text-red-600 mt-1">Please choose a payment method.</p>
          )}
          <p className="text-stone-500 text-sm mt-3">
            To reserve your spot, kindly note that a ₱150 fee is required.
            Cancelled reservations are not automatically refundable.
          </p>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 transition duration-200 text-white font-semibold px-16 py-2 text-lg rounded-md"
          >
            Proceed
          </button>
        </div>
      </form>
    </div>
  )
}

export default function ReservationPage() {
  return (
    <main className="max-w-6xl mx-auto w-full px-6 py-20">
      <ProtectedPage>
        {({ user, customerInfo }) => (
          <AuthenticatedPage user={user} customerInfo={customerInfo} />
        )}
      </ProtectedPage>
    </main>
  )
}

import { CircledArrowLeft } from "@/components/HeroIcons"
import { ProtectedPage } from "@/components/account/ProtectedPage"
import { LoadingSpinner } from "@/components/loading"
import { api } from "@/utils/api"
import { getEarliestAndLatestTime } from "@/utils/reservation-time"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Reservation,
  ReservationSelectedTable,
  ReservationSelectedTime,
} from "@prisma/client"
import { User } from "firebase/auth"
import { DateTime } from "luxon"
import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { z } from "zod"

function SourceStatus({
  sourceId,
  paymentIntentId,
  reservationId,
}: {
  sourceId: string
  paymentIntentId: string
  reservationId: number
}) {
  const { data, isLoading, isError } = api.payment.getSource.useQuery({
    id: sourceId,
  })
  const { refetch } = api.payment.getPaymentIntent.useQuery({
    id: paymentIntentId,
  })

  const { mutate: refreshPaymentIntent } =
    api.payment.refreshPaymentIntent.useMutation({
      onSuccess: () => refetch(),
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<paymentMethodType>({
    resolver: zodResolver(paymentMethodSchema),
  })

  if (isLoading) return <LoadingSpinner />
  if (isError) return <div>An error occured.</div>
  if (!data) return <div>No source found.</div>

  return (
    <div>
      {data.data.attributes.status === "expired" && (
        <form
          onSubmit={handleSubmit((formData) =>
            refreshPaymentIntent({
              id: paymentIntentId,
              paymentMethod: formData.paymentMethod,
              paymentFor: "RESERVATION",
            })
          )}
        >
          <p className="mb-1">
            The payment session for this reservation expired. Please choose a
            new payment method.
          </p>
          <div className="grid mb-1">
            <label className="flex gap-3">
              <input
                type="radio"
                value="GCASH"
                {...register("paymentMethod")}
              />
              <span>GCash</span>
            </label>
            <label className="flex gap-3">
              <input type="radio" value="MAYA" {...register("paymentMethod")} />
              <span>Maya</span>
            </label>
          </div>
          <div className="text-right font-medium">
            <button
              type="submit"
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-400 transition duration-200"
            >
              Proceed
            </button>
          </div>
        </form>
      )}
      {data.data.attributes.status === "pending" && (
        <div>
          <p className="mb-1">
            The payment for this reservation is still pending. Click the button
            below to continue the payment process.
          </p>
          <div className="flex justify-end gap-3">
            <CancelPaymentButton reservationId={reservationId} />
            <a
              href={data.data.attributes.redirect.checkout_url}
              className="inline-block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-400 transition duration-200"
            >
              Continue
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function CancelPaymentButton({ reservationId }: { reservationId: number }) {
  const { refetch, isLoading: isLoadingReservation } =
    api.reservation.getOne.useQuery({
      id: reservationId,
    })

  const { mutate: cancelPayment, isLoading } =
    api.reservation.cancelPayment.useMutation({
      onSuccess: () => refetch(),
    })

  return (
    <button
      type="button"
      className="bg-red-500 hover:bg-red-400 transition duration-200 text-white font-medium px-4 py-2 rounded-md disabled:bg-red-300"
      disabled={isLoadingReservation || isLoading}
      onClick={() =>
        cancelPayment({
          id: reservationId,
        })
      }
    >
      Cancel Reservation
    </button>
  )
}

const paymentMethodSchema = z.object({
  paymentMethod: z.union([z.literal("MAYA"), z.literal("GCASH")]),
})

type paymentMethodType = z.infer<typeof paymentMethodSchema>

function PaymentStatusSection({
  id,
  reservationId,
}: {
  id: string
  reservationId: number
}) {
  const { data, isLoading, isError, refetch } =
    api.payment.getPaymentIntent.useQuery({
      id,
    })

  const { refetch: refetchReservation, isRefetching } =
    api.reservation.getOne.useQuery({
      id: reservationId,
    })

  const { mutate: refreshPaymentIntent } =
    api.payment.refreshPaymentIntent.useMutation({
      onSuccess: () => refetch(),
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<paymentMethodType>({
    resolver: zodResolver(paymentMethodSchema),
  })

  if (isLoading) return <LoadingSpinner />
  if (isError) return <div>An error occured</div>
  if (!data) return <div>No payment intent found.</div>

  return (
    <section className="max-w-xl mx-auto bg-stone-100 px-6 py-4 mt-6 mb-8 rounded-lg">
      {data.data.attributes.status === "succeeded" && (
        <div className="text-center">
          <p className="mb-1">Payment succeeded. Try refreshing this page.</p>
          <button
            type="button"
            disabled={isRefetching}
            className="px-4 pb-2 pt-3 w-32 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 transition duration-200 text-white font-medium rounded-md inline-block"
            onClick={() => refetchReservation()}
          >
            {isRefetching ? <>Refreshing ...</> : <>Refresh</>}
          </button>
        </div>
      )}
      {data.data.attributes.status === "processing" && (
        <p className="text-center">
          We are still processing your payment. Please return in a few moment.
        </p>
      )}
      {data.data.attributes.status === "awaiting_next_action" && (
        <>
          {data.data.attributes.next_action === null ? (
            <p className="text-center">
              Awaiting next action, but no next action could be found.
            </p>
          ) : (
            <SourceStatus
              sourceId={
                data.data.attributes.next_action.redirect.url.split("id=")[1]
              }
              paymentIntentId={data.data.id}
              reservationId={reservationId}
            />
          )}
        </>
      )}
      {data.data.attributes.status === "awaiting_payment_method" && (
        <form
          onSubmit={handleSubmit((formData) =>
            refreshPaymentIntent({
              id: data.data.id,
              paymentMethod: formData.paymentMethod,
              paymentFor: "RESERVATION",
            })
          )}
        >
          <p className="mb-1">
            No payment has yet been made for this reservation. Please choose a
            payment method.
          </p>
          <div className="grid mb-1">
            <label className="flex gap-3">
              <input
                type="radio"
                value="GCASH"
                {...register("paymentMethod")}
              />
              <span>GCash</span>
            </label>
            <label className="flex gap-3">
              <input type="radio" value="MAYA" {...register("paymentMethod")} />
              <span>Maya</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 font-medium">
            <CancelPaymentButton reservationId={reservationId} />
            <button
              type="submit"
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-400 transition duration-200"
            >
              Proceed
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

function ReservationDetailsSection({
  reservation,
  user,
}: {
  reservation: Reservation & {
    reservationSelectedTimes: ReservationSelectedTime[]
    reservationSelectedTables: ReservationSelectedTable[]
  }
  user: User
}) {
  const { refetch } = api.reservation.getOne.useQuery({
    id: reservation.id,
  })
  const { mutate: cancelReservation, isLoading } =
    api.reservation.cancel.useMutation({
      onSuccess: () => refetch(),
    })
  const { earliestTimeslot, latestTimeslot } = getEarliestAndLatestTime(
    reservation.reservationSelectedTimes
  )

  return (
    <section className="max-w-lg [box-shadow:_0px_2px_4px_2px_rgba(0,_0,_0,_0.25)] rounded-2xl mx-auto text-center">
      <article className="px-6 pt-8 pb-5">
        <p>{user.displayName}</p>
        <p className="font-semibold">
          {DateTime.fromJSDate(new Date(reservation.selectedDate), {
            zone: "Asia/Manila",
          }).toLocaleString(DateTime.DATE_HUGE)}
        </p>
        <p className="font-semibold mb-3">
          at{" "}
          {DateTime.fromISO(earliestTimeslot, {
            setZone: true,
          }).toLocaleString(DateTime.TIME_SIMPLE)}
          {" to "}
          {DateTime.fromISO(latestTimeslot, {
            setZone: true,
          }).toLocaleString(DateTime.TIME_SIMPLE)}
        </p>
        <p className="text-red-600 font-semibold">
          TABLE{" "}
          {reservation.reservationSelectedTables
            .map((reservationSelectedTable) => reservationSelectedTable.table)
            .join(", ")}
        </p>
      </article>
      <article className="px-6">
        <hr />
      </article>
      <article className="px-6 py-4">
        <p className="font-semibold">Contact</p>
        <p>673 Quirino Highway, San Bartolome</p>
        <p>Novaliches, Quezon City</p>
        <p>(02) 8806-3049</p>
      </article>
      <article className="px-6">
        <hr />
      </article>
      <article className="px-6 py-4">
        <p className="font-semibold">A note from us</p>
        <p className="max-w-sm mx-auto">
          Thank you for booking with us! Your reservation at Filipino de Cuisine
          is confirmed. You may cancel your reservation only up to the day
          before your reserved date. Cancelled reservation are not refundable.
        </p>
        {reservation.paymentStatus === "Fulfilled" &&
          reservation.attendedStatus === "Pending" && (
            <button
              type="button"
              className="bg-red-500 hover:bg-red-400 disabled:bg-red-300 transition duration-200 font-medium text-white pt-2 pb-2 px-4 rounded-md mt-2"
              disabled={isLoading}
              onClick={() =>
                cancelReservation({
                  id: reservation.id,
                })
              }
            >
              Cancel Reservation
            </button>
          )}
      </article>
      <article className="bg-neutral-100 font-medium py-4">
        Your Reservation ID is {reservation.id}
      </article>
    </section>
  )
}

function AuthenticatedPage({ user }: { user: User }) {
  const { query, isReady } = useRouter()
  const { data, isLoading, isError } = api.reservation.getOne.useQuery(
    {
      id: parseInt(query.id as string),
    },
    {
      enabled: isReady && typeof query.id === "string",
    }
  )

  if (isLoading) return <LoadingSpinner />
  if (isError) return <div>An error occured</div>
  if (!data) return <div>No reservation found.</div>

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/account/reservations" className="text-emerald-500">
          <CircledArrowLeft />
        </Link>
        <h2 className="font-semibold text-2xl flex items-end">Reservation</h2>
      </div>
      {data.paymentStatus === "Pending" && (
        <PaymentStatusSection
          id={data.paymentIntentId}
          reservationId={data.id}
        />
      )}
      {(data.paymentStatus === "Cancelled" ||
        data.attendedStatus === "Cancelled") && (
        <p className="text-center pt-6 pb-8">
          This reservation has been cancelled.
        </p>
      )}
      <ReservationDetailsSection reservation={data} user={user} />
    </div>
  )
}

export default function ViewReservationPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {({ user }) => <AuthenticatedPage user={user} />}
      </ProtectedPage>
    </main>
  )
}

import { AccountPageSwitcher } from "@/components/account/AccountPageSwitcher"
import { ProtectedPage } from "@/components/account/ProtectedPage"
import { LoadingSpinner } from "@/components/loading"
import { api } from "@/utils/api"
import { getEarliestAndLatestTime } from "@/utils/reservation-time"
import {
  AttendedStatus,
  Reservation,
  ReservationSelectedTable,
  ReservationSelectedTime,
} from "@prisma/client"
import { User } from "firebase/auth"
import { DateTime } from "luxon"
import Link from "next/link"
import { Fragment, useState } from "react"

function ReservationsListSection({
  reservations,
}: {
  reservations: (Reservation & {
    reservationSelectedTimes: ReservationSelectedTime[]
    reservationSelectedTables: ReservationSelectedTable[]
  })[]
}) {
  const [currentTab, setCurrentTab] = useState<"" | AttendedStatus>("")
  function formattedDate(givenDate: Date) {
    const year = givenDate.getFullYear()
    const month = givenDate.getMonth() + 1
    const date = givenDate.getDate()

    const monthStr = month < 10 ? `0${month}` : `${month}`
    const dateStr = date < 10 ? `0${date}` : `${date}`

    return `${year}-${monthStr}-${dateStr}`
  }

  const filteredReservations = reservations.filter((reservation) => {
    if (currentTab === "") return true
    if (currentTab === reservation.attendedStatus) return true

    return false
  })

  if (reservations.length === 0)
    return (
      <section className="text-center">
        <p className="mb-3">You have not yet made any reservations.</p>
        <Link
          href="/reservation"
          className="px-6 bg-emerald-500 hover:bg-emerald-400 transition duration-200 text-white text-lg rounded-md pb-2 pt-3 font-semibold inline-block"
        >
          Make a Reservation
        </Link>
      </section>
    )

  return (
    <>
      <section className="border-b border-stone-400 grid grid-cols-2 lg:grid-cols-5 font-medium mb-3">
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === ""
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : "border-b-4 border-white"
            }`}
            onClick={() => setCurrentTab("")}
          >
            All
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === "Pending"
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : "border-b-4 border-white"
            }`}
            onClick={() => setCurrentTab("Pending")}
          >
            Pending
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === "Missed"
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : "border-b-4 border-white"
            }`}
            onClick={() => setCurrentTab("Missed")}
          >
            Missed
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === "Completed"
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : "border-b-4 border-white"
            }`}
            onClick={() => setCurrentTab("Completed")}
          >
            Completed
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === "Cancelled"
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : "border-b-4 border-white"
            }`}
            onClick={() => setCurrentTab("Cancelled")}
          >
            Cancelled
          </button>
        </div>
      </section>
      <section className="max-w-4xl mx-auto lg:px-6">
        <div>
          <div className="hidden lg:grid grid-cols-[8rem_10rem_10rem_10rem_1fr] gap-3 text-stone-500 font-semibold py-3">
            <div>Reservation ID</div>
            <div>Date</div>
            <div>Time</div>
            <div>Status</div>
            <div></div>
          </div>
          {filteredReservations.length === 0 ? (
            <div className="text-center mt-3">No reservations found.</div>
          ) : (
            <>
              {filteredReservations.map((reservation) => {
                const { earliestTimeslot, latestTimeslot } =
                  getEarliestAndLatestTime(reservation.reservationSelectedTimes)

                return (
                  <Fragment key={reservation.id}>
                    <article className="hidden lg:grid grid-cols-[8rem_10rem_10rem_10rem_1fr] gap-3 py-3">
                      <div>{reservation.id}</div>
                      {/* FIXME: This should be reservation date, not created date. */}
                      <div>{formattedDate(reservation.createdAt)}</div>
                      <div>
                        {earliestTimeslot.toLocaleString(DateTime.TIME_SIMPLE)}
                        {" - "}
                        {latestTimeslot.toLocaleString(DateTime.TIME_SIMPLE)}
                      </div>
                      <div>{reservation.attendedStatus}</div>
                      <div>
                        <Link
                          href={`/reservation/${reservation.id}`}
                          className="text-emerald-500 font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </article>
                    <article className="lg:hidden border border-zinc-300 px-6 py-3 rounded-md mb-3">
                      <div className="text-lg font-medium">
                        Reservation ID: {reservation.id}
                      </div>
                      {/* FIXME: This should be reservation date, not created date. */}
                      <div>Date: {formattedDate(reservation.createdAt)}</div>
                      <div>
                        Time:{" "}
                        {earliestTimeslot.toLocaleString(DateTime.TIME_SIMPLE)}
                        {" - "}
                        {latestTimeslot.toLocaleString(DateTime.TIME_SIMPLE)}
                      </div>
                      <div>Status: {reservation.attendedStatus}</div>
                      <div>
                        <Link
                          href={`/reservation/${reservation.id}`}
                          className="bg-emerald-500 hover:bg-emerald-400 transition duration-200 text-white block text-center py-1 w-full rounded-md font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </article>
                  </Fragment>
                )
              })}
            </>
          )}
        </div>
      </section>
    </>
  )
}

function AuthenticatedPage({ user }: { user: User }) {
  const { data, isLoading, isError } = api.reservation.getAll.useQuery()

  return (
    <div className="grid lg:grid-cols-[16rem_1fr] gap-3">
      <AccountPageSwitcher user={user} />
      <section>
        <h2 className="px-6 text-2xl font-semibold pb-3">
          Reservation History
        </h2>
        <>
          {isLoading ? (
            <div className="pt-3">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {isError ? (
                <div className="text-center pt-3">An error occured.</div>
              ) : (
                <ReservationsListSection reservations={data} />
              )}
            </>
          )}
        </>
      </section>
    </div>
  )
}

export default function ReservationsPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {({ user }) => <AuthenticatedPage user={user} />}
      </ProtectedPage>
    </main>
  )
}

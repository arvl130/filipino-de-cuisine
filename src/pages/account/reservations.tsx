import { ChevronLeft, ChevronRight } from "@/components/HeroIcons"
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

const MAX_VISIBLE_ENTRIES = 5

function ReservationsListSection({
  reservations,
}: {
  reservations: (Reservation & {
    reservationSelectedTimes: ReservationSelectedTime[]
    reservationSelectedTables: ReservationSelectedTable[]
  })[]
}) {
  const [currentTab, setCurrentTab] = useState<"" | AttendedStatus>("")

  const filteredReservations = reservations.filter((reservation) => {
    if (currentTab === "") return true
    if (currentTab === reservation.attendedStatus) return true

    return false
  })

  const [currentPage, setCurrentPage] = useState(0)

  function getVisibleReservations(
    reservations: (Reservation & {
      reservationSelectedTimes: ReservationSelectedTime[]
      reservationSelectedTables: ReservationSelectedTable[]
    })[]
  ) {
    const start = currentPage * MAX_VISIBLE_ENTRIES
    const end = start + MAX_VISIBLE_ENTRIES

    return reservations.slice(start, end)
  }

  function getPageCount(
    reservations: (Reservation & {
      reservationSelectedTimes: ReservationSelectedTime[]
      reservationSelectedTables: ReservationSelectedTable[]
    })[]
  ) {
    return Math.ceil(reservations.length / MAX_VISIBLE_ENTRIES)
  }

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
            onClick={() => {
              setCurrentTab("")
              setCurrentPage(0)
            }}
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
            onClick={() => {
              setCurrentTab("Pending")
              setCurrentPage(0)
            }}
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
            onClick={() => {
              setCurrentTab("Missed")
              setCurrentPage(0)
            }}
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
            onClick={() => {
              setCurrentTab("Completed")
              setCurrentPage(0)
            }}
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
            onClick={() => {
              setCurrentTab("Cancelled")
              setCurrentPage(0)
            }}
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
              <div className="min-h-[16rem]">
                {getVisibleReservations(filteredReservations).map(
                  (reservation) => {
                    const { earliestTimeslot, latestTimeslot } =
                      getEarliestAndLatestTime(
                        reservation.reservationSelectedTimes
                      )

                    return (
                      <Fragment key={reservation.id}>
                        <article className="hidden lg:grid grid-cols-[8rem_10rem_10rem_10rem_1fr] gap-3 py-3">
                          <div>{reservation.id}</div>
                          <div>{reservation.selectedDate}</div>
                          <div>
                            {earliestTimeslot.toLocaleString(
                              DateTime.TIME_SIMPLE
                            )}
                            {" - "}
                            {latestTimeslot.toLocaleString(
                              DateTime.TIME_SIMPLE
                            )}
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
                        <article className="lg:hidden border border-zinc-300 px-6 pt-3 pb-4 rounded-md mb-3">
                          <div className="text-lg font-medium">
                            Reservation ID: {reservation.id}
                          </div>
                          <div>Date: {reservation.selectedDate}</div>
                          <div>
                            Time:{" "}
                            {earliestTimeslot.toLocaleString(
                              DateTime.TIME_SIMPLE
                            )}
                            {" - "}
                            {latestTimeslot.toLocaleString(
                              DateTime.TIME_SIMPLE
                            )}
                          </div>
                          <div className="mb-1">
                            Status: {reservation.attendedStatus}
                          </div>
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
                  }
                )}
              </div>
              <div className="flex justify-between mb-12">
                <button
                  type="button"
                  className={`disabled:text-zinc-300 flex items-center gap-1 font-medium px-4 py-2 rounded-md transition duration-200 ${
                    currentPage === 0 ? "" : "hover:bg-zinc-200"
                  }`}
                  disabled={currentPage === 0}
                  onClick={() =>
                    setCurrentPage((currCurrentPage) => currCurrentPage - 1)
                  }
                >
                  <ChevronLeft /> Previous
                </button>
                <button
                  type="button"
                  className={`disabled:text-zinc-300 flex items-center gap-1 font-medium px-4 py-2 rounded-md transition duration-200 ${
                    currentPage === getPageCount(filteredReservations) - 1
                      ? ""
                      : "hover:bg-zinc-200"
                  }`}
                  disabled={
                    currentPage === getPageCount(filteredReservations) - 1
                  }
                  onClick={() =>
                    setCurrentPage((currCurrentPage) => currCurrentPage + 1)
                  }
                >
                  Next <ChevronRight />
                </button>
              </div>
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

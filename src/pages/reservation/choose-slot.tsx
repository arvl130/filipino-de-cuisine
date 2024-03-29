import { ProtectedPage } from "@/components/account/ProtectedPage"
import { useReservationDetailsStore } from "@/stores/reservationDetails"
import Image from "next/image"
import { useEffect, useState } from "react"
import { DateTime } from "luxon"
import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { LoadingSpinner } from "@/components/loading"

function TimeslotButton({
  hour,
  minute,
  adjacent,
}: {
  hour: number
  minute: number
  adjacent: number[][]
}) {
  const { reservationDate, selectedTimeslots, addTimeslot, removeTimeslot } =
    useReservationDetailsStore()

  const startIsoDate = DateTime.fromObject({
    day: parseInt(reservationDate.split("-")[2]),
    month: parseInt(reservationDate.split("-")[1]),
    year: parseInt(reservationDate.split("-")[0]),
    hour,
    minute,
  }).toISO()

  const adjacentDates = adjacent.map((adj) => {
    return DateTime.fromObject({
      day: parseInt(reservationDate.split("-")[2]),
      month: parseInt(reservationDate.split("-")[1]),
      year: parseInt(reservationDate.split("-")[0]),
      hour: adj[0],
      minute: adj[1],
    }).toISO()!
  })

  const {
    isLoading,
    isError,
    data: reservedSlots,
  } = api.reservation.getReservedSlotsByStartIsoDate.useQuery(
    {
      startIsoDate: startIsoDate as string,
    },
    {
      enabled: typeof startIsoDate === "string",
    }
  )

  if (!startIsoDate)
    return (
      <button type="button" className="border-2 border-black pt-1 font-medium">
        invalid
      </button>
    )

  if (isLoading)
    return (
      <button type="button" className="border-2 border-black pt-1 font-medium">
        ...
      </button>
    )

  if (isError)
    return (
      <button
        type="button"
        className="border-2 border-black pt-1 font-medium rounded-sm"
      >
        error
      </button>
    )

  // Timeslot is still has available tables.
  if (reservedSlots.length < 5)
    return (
      <button
        type="button"
        className={`transition duration-200 border-2 border-black pt-1 font-medium rounded-sm ${
          selectedTimeslots.includes(startIsoDate)
            ? "bg-neutral-300"
            : "hover:bg-neutral-100"
        }`}
        onClick={() => {
          if (selectedTimeslots.includes(startIsoDate))
            removeTimeslot(startIsoDate)
          else {
            if (
              selectedTimeslots.some((selectedTimeslot) => {
                if (adjacentDates.includes(selectedTimeslot)) return false

                return true
              })
            )
              return

            addTimeslot(startIsoDate)
          }
        }}
      >
        {hour > 12 ? `${hour - 12}` : hour}:
        {minute < 10 ? `0${minute}` : minute} {hour > 11 ? "PM" : "AM"}
      </button>
    )

  // Timeslot is full.
  return (
    <button
      type="button"
      className="border-2 border-black bg-black text-white pt-1 font-medium rounded-sm"
    >
      {hour > 12 ? `${hour - 12}` : hour}:{minute < 10 ? `0${minute}` : minute}{" "}
      {hour > 11 ? "PM" : "AM"}
    </button>
  )
}

function ChooseTimeslotSection() {
  return (
    <section className="mb-3">
      <label className="font-medium">Time slot</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3 justify-center mb-3">
        <TimeslotButton hour={10} minute={0} adjacent={[[11, 15]]} />
        <TimeslotButton
          hour={11}
          minute={15}
          adjacent={[
            [10, 0],
            [13, 30],
          ]}
        />
        <TimeslotButton
          hour={13}
          minute={30}
          adjacent={[
            [11, 15],
            [14, 45],
          ]}
        />
        <TimeslotButton
          hour={14}
          minute={45}
          adjacent={[
            [13, 30],
            [16, 0],
          ]}
        />
        <TimeslotButton
          hour={16}
          minute={0}
          adjacent={[
            [14, 45],
            [17, 15],
          ]}
        />
        <TimeslotButton
          hour={17}
          minute={15}
          adjacent={[
            [16, 0],
            [18, 30],
          ]}
        />
        <TimeslotButton
          hour={18}
          minute={30}
          adjacent={[
            [17, 15],
            [20, 45],
          ]}
        />
        <TimeslotButton hour={20} minute={45} adjacent={[[18, 30]]} />
      </div>
      <p className="text-stone-500 text-sm mb-3">
        Each time slot occupies about an hour.
      </p>
    </section>
  )
}

function TableslotButton({
  id,
  availableTableIds,
}: {
  id: string
  availableTableIds: string[]
}) {
  const { selectedTableslots, addTableslot, removeTableslot } =
    useReservationDetailsStore()
  const isTableslotSelected = selectedTableslots.includes(id)
  const isTableSlotAvailable = availableTableIds.includes(id)

  return (
    <button
      type="button"
      disabled={!isTableSlotAvailable}
      className={`transition duration-200 border-2 border-black disabled:bg-black disabled:text-white font-medium rounded-full w-12 h-12 ${
        isTableSlotAvailable && isTableslotSelected
          ? "bg-neutral-300"
          : "hover:bg-neutral-100"
      }`}
      onClick={() => {
        if (isTableslotSelected) removeTableslot(id)
        else addTableslot(id)
      }}
    >
      {id}
    </button>
  )
}

function TableslotButtons() {
  const { selectedTimeslots } = useReservationDetailsStore()
  const {
    isLoading: isLoadingAll,
    isError: isErrorAll,
    data: tables,
  } = api.reservation.getAllTables.useQuery()

  const {
    isLoading: isLoadingAvailable,
    isError: isErrorAvailable,
    data: availableTableIds,
  } = api.reservation.getAvailableTableIdsForTimeslots.useQuery({
    selectedTimeslots,
  })

  if (isLoadingAll || isLoadingAvailable) return <div>...</div>
  if (isErrorAll || isErrorAvailable) return <div>error</div>

  return (
    <>
      {tables.map((table) => (
        <TableslotButton
          key={table.id}
          id={table.id}
          availableTableIds={availableTableIds}
        />
      ))}
    </>
  )
}

function ChooseTableslotSection() {
  const { selectedTimeslots } = useReservationDetailsStore()
  return (
    <section className="mb-6">
      <label className="font-medium">Table slot</label>
      <div className="flex flex-wrap gap-6 justify-center mb-3 min-h-[3rem]">
        {selectedTimeslots.length === 0 ? (
          <>Choose your desired timeslot(s).</>
        ) : (
          <TableslotButtons />
        )}
      </div>
      <p className="text-stone-500 text-sm mb-3">
        Each table can fit 2-3 persons comfortably.
      </p>
      <div className="flex flex-wrap gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full h-6 w-6 bg-black"></div>
          Fully booked
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full h-6 w-6 border-2 border-black"></div>
          Available
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-full h-6 w-6 bg-neutral-300"></div>
          Selected
        </div>
      </div>
    </section>
  )
}

function PlaceReservationModal({
  cancelFn,
  continueFn,
  isDisabled,
}: {
  cancelFn: () => void
  continueFn: () => void
  isDisabled: boolean
}) {
  return (
    <div className="fixed inset-0 z-20 bg-black/20 flex justify-center items-center">
      <div className="bg-white max-w-lg w-full rounded-2xl px-8 py-6">
        <p className="text-justify mb-3">
          The following action will create your reservation, and you will be
          redirected to another page where you can fulfill your payment.
          Continue?
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="px-6 pt-2 pb-1 text-emerald-500 hover:bg-emerald-400 hover:border-emerald-400 disabled:text-emerald-300 disabled:border-emerald-300 hover:text-white transition duration-200 border-emerald-500 border rounded-md font-medium"
            onClick={() => cancelFn()}
            disabled={isDisabled}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 pt-2 pb-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 text-white rounded-md font-medium"
            disabled={isDisabled}
            onClick={continueFn}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

function AuthenticatedPage() {
  const [isPlaceReservationModalVisible, setIsPlaceReservationModalVisible] =
    useState(false)
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] =
    useState(false)

  const {
    selectedTimeslots,
    selectedTableslots,
    reservationDate,
    customerName,
    contactNumber,
    additionalNotes,
    paymentMethod,
  } = useReservationDetailsStore()

  const { mutate: createReservation, isLoading: isPlacingReservation } =
    api.reservation.create.useMutation({
      onSuccess: ({ paymentUrl }) => {
        setHasSubmittedSuccessfully(true)
        location.href = paymentUrl
      },
    })

  const router = useRouter()
  useEffect(() => {
    if (reservationDate === "") router.push("/reservation")
  }, [reservationDate, router])

  if (reservationDate === "") return <LoadingSpinner />

  return (
    <div className="[box-shadow:_0px_1px_4px_1px_rgba(0,_0,_0,_0.25)] rounded-2xl shadow-md px-8 py-6 max-w-4xl mx-auto sm:grid sm:grid-cols-[16rem_1fr] gap-8">
      <div className="hidden sm:block">
        <Image
          src="/assets/reservation/side-bg.webp"
          alt="side banner"
          height={256}
          width={512}
          className="h-full w-full rounded-2xl object-cover object-right-bottom scale-y-125"
        />
      </div>
      <div>
        <ChooseTimeslotSection />
        <ChooseTableslotSection />
        <div className="text-center">
          <button
            type="button"
            disabled={
              customerName === "" ||
              contactNumber === "" ||
              reservationDate === "" ||
              paymentMethod === "" ||
              selectedTimeslots.length === 0 ||
              selectedTableslots.length === 0 ||
              isPlacingReservation ||
              hasSubmittedSuccessfully
            }
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 text-white font-semibold px-8 py-2 text-lg rounded-md"
            onClick={() => {
              if (paymentMethod === "") return
              if (selectedTimeslots.length === 0) return
              if (selectedTableslots.length === 0) return

              setIsPlaceReservationModalVisible(true)
            }}
          >
            Place Reservation
          </button>
        </div>
        {isPlaceReservationModalVisible && (
          <PlaceReservationModal
            continueFn={() => {
              if (paymentMethod === "") return
              if (selectedTimeslots.length === 0) return
              if (selectedTableslots.length === 0) return

              const [selectedTimeslot, ...otherSelectedTimeslots] =
                selectedTimeslots
              const [selectedTableslot, ...otherSelectedTableslots] =
                selectedTableslots

              createReservation({
                customerName,
                contactNumber,
                reservationDate,
                additionalNotes,
                paymentMethod,
                selectedTimeslots: [
                  selectedTimeslot,
                  ...otherSelectedTimeslots,
                ],
                selectedTableslots: [
                  selectedTableslot,
                  ...otherSelectedTableslots,
                ],
                fee: 150,
              })
            }}
            cancelFn={() => setIsPlaceReservationModalVisible(false)}
            isDisabled={
              customerName === "" ||
              contactNumber === "" ||
              reservationDate === "" ||
              paymentMethod === "" ||
              selectedTimeslots.length === 0 ||
              selectedTableslots.length === 0 ||
              isPlacingReservation ||
              hasSubmittedSuccessfully
            }
          />
        )}
      </div>
    </div>
  )
}

export default function ReservationPage() {
  return (
    <main className="max-w-6xl mx-auto w-full px-6 py-20">
      <ProtectedPage>{() => <AuthenticatedPage />}</ProtectedPage>
    </main>
  )
}

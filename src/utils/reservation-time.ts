import { ReservationSelectedTime } from "@prisma/client"

export function getEarliestAndLatestTime(
  reservationSelectedTimes: ReservationSelectedTime[]
) {
  const [firstTimeslot, ...otherTimeslots] = reservationSelectedTimes.map(
    ({ time }) => time
  )

  const earliestTimeslot = otherTimeslots.reduce(
    (prevTimeslot, currTimeslot) => {
      if (new Date(currTimeslot).getTime() < new Date(prevTimeslot).getTime())
        return currTimeslot

      return prevTimeslot
    },
    firstTimeslot
  )

  const latestTimeslot = otherTimeslots.reduce((prevTimeslot, currTimeslot) => {
    if (new Date(currTimeslot).getTime() > new Date(prevTimeslot).getTime())
      return currTimeslot

    return prevTimeslot
  }, firstTimeslot)

  return { earliestTimeslot, latestTimeslot }
}

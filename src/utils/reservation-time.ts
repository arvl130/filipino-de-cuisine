import { ReservationSelectedTime } from "@prisma/client"
import { DateTime } from "luxon"

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

  return {
    earliestTimeslot: DateTime.fromISO(earliestTimeslot, {
      setZone: true,
    }),
    latestTimeslot: DateTime.fromISO(latestTimeslot, {
      setZone: true,
    }).plus({
      hour: 1,
    }),
  }
}

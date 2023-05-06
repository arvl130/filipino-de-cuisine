import { create } from "zustand"

interface ReservationDetailsState {
  customerName: string
  contactNumber: string
  reservationDate: string
  additionalNotes: string
  paymentMethod: "" | "MAYA" | "GCASH"
  selectedTimeslots: string[]
  selectedTableslots: string[]
  setCustomerName: (newCustomerName: string) => void
  setContactNumber: (newContactNumber: string) => void
  setReservationDate: (newReservationDate: string) => void
  setAdditionalNotes: (newAdditionalNotes: string) => void
  setPaymentMethod: (newPaymentMethod: "MAYA" | "GCASH") => void
  addTimeslot: (timeslot: string) => void
  removeTimeslot: (timeslot: string) => void
  addTableslot: (tableslot: string) => void
  removeTableslot: (tableslot: string) => void
}

export const useReservationDetailsStore = create<ReservationDetailsState>(
  (set) => ({
    customerName: "",
    contactNumber: "",
    reservationDate: "",
    additionalNotes: "",
    paymentMethod: "",
    selectedTimeslots: [],
    selectedTableslots: [],
    setCustomerName(newCustomerName) {
      set((reservationDetails) => ({
        ...reservationDetails,
        customerName: newCustomerName,
      }))
    },
    setContactNumber(newContactNumber) {
      set((reservationDetails) => ({
        ...reservationDetails,
        contactNumber: newContactNumber,
      }))
    },
    setReservationDate(newReservationDate) {
      set((reservationDetails) => ({
        ...reservationDetails,
        reservationDate: newReservationDate,
      }))
    },
    setAdditionalNotes(newAdditionalNotes) {
      set((reservationDetails) => ({
        ...reservationDetails,
        additionalNotes: newAdditionalNotes,
      }))
    },
    setPaymentMethod(newPaymentMethod) {
      set((reservationDetails) => ({
        ...reservationDetails,
        paymentMethod: newPaymentMethod,
      }))
    },
    addTimeslot(timeslot) {
      set((reservationDetails) => ({
        ...reservationDetails,
        selectedTimeslots: [...reservationDetails.selectedTimeslots, timeslot],
      }))
    },
    removeTimeslot(timeslot) {
      set((reservationDetails) => ({
        ...reservationDetails,
        selectedTimeslots: reservationDetails.selectedTimeslots.filter(
          (selectedTimeslot) => selectedTimeslot !== timeslot
        ),
      }))
    },
    addTableslot(tableslot) {
      set((reservationDetails) => ({
        ...reservationDetails,
        selectedTableslots: [
          ...reservationDetails.selectedTableslots,
          tableslot,
        ],
      }))
    },
    removeTableslot(tableslot) {
      set((reservationDetails) => ({
        ...reservationDetails,
        selectedTableslots: reservationDetails.selectedTableslots.filter(
          (selectedTableslot) => selectedTableslot !== tableslot
        ),
      }))
    },
  })
)

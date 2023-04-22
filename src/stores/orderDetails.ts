import { create } from "zustand"

interface OrderDetailsState {
  customerName: string
  contactNumber: string
  destinationAddress: string
  additionalNotes: string
  setCustomerName: (newCustomerName: string) => void
  setContactNumber: (newContactNumber: string) => void
  setDestinationAddress: (newDestinationAddress: string) => void
  setAdditionalNotes: (newAdditionalNotes: string) => void
}

export const useOrderDetailsStore = create<OrderDetailsState>((set) => ({
  customerName: "",
  contactNumber: "",
  destinationAddress: "",
  additionalNotes: "",
  setCustomerName(newCustomerName) {
    set((orderDetails) => ({
      ...orderDetails,
      customerName: newCustomerName,
    }))
  },
  setContactNumber(newContactNumber) {
    set((orderDetails) => ({
      ...orderDetails,
      contactNumber: newContactNumber,
    }))
  },
  setDestinationAddress(newDestinationAddress) {
    set((orderDetails) => ({
      ...orderDetails,
      destinationAddress: newDestinationAddress,
    }))
  },
  setAdditionalNotes(newAdditionalNotes) {
    set((orderDetails) => ({
      ...orderDetails,
      additionalNotes: newAdditionalNotes,
    }))
  },
}))

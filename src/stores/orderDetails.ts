import { create } from "zustand"

interface OrderDetailsState {
  customerName: string
  contactNumber: string
  destinationAddress: string
  additionalNotes: string
  selectedMenuItemIds: number[]
  setCustomerName: (newCustomerName: string) => void
  setContactNumber: (newContactNumber: string) => void
  setDestinationAddress: (newDestinationAddress: string) => void
  setAdditionalNotes: (newAdditionalNotes: string) => void
  addMenuItemId: (menuItemId: number) => void
  removeMenuItemId: (menuItemId: number) => void
}

export const useOrderDetailsStore = create<OrderDetailsState>((set) => ({
  customerName: "",
  contactNumber: "",
  destinationAddress: "",
  additionalNotes: "",
  selectedMenuItemIds: [],
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
  addMenuItemId(newMenuItemId) {
    set((orderDetails) => ({
      ...orderDetails,
      selectedMenuItemIds: [...orderDetails.selectedMenuItemIds, newMenuItemId],
    }))
  },
  removeMenuItemId(menuItemIdToDelete) {
    set((orderDetails) => ({
      ...orderDetails,
      selectedMenuItemIds: orderDetails.selectedMenuItemIds.filter(
        (menuItemId) => menuItemId !== menuItemIdToDelete
      ),
    }))
  },
}))

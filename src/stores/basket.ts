import { create } from "zustand"

interface BasketState {
  selectedItems: Array<{
    id: number
    quantity: number
  }>
  addItem: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  incrementItemQuantity: (id: number) => void
  decrementItemQuantity: (id: number) => void
  orderDetails: {
    customerName: string
    contactNumber: string
    destinationAddress: string
    additionalNotes: string
  }
  setOrderDetails: (orderDetails: {
    customerName?: string
    contactNumber?: string
    destinationAddress?: string
    additionalNotes?: string
  }) => void
}

export const useBasketStore = create<BasketState>((set) => ({
  selectedItems: [],
  addItem(id, quantity) {
    set(({ selectedItems }) => ({
      selectedItems: [...selectedItems, { id, quantity }],
    }))
  },
  removeItem(id) {
    set(({ selectedItems }) => ({
      selectedItems: selectedItems.filter(
        (selectedItem) => selectedItem.id !== id
      ),
    }))
  },
  incrementItemQuantity(id) {
    set(({ selectedItems }) => ({
      selectedItems: selectedItems.map((selectedItem) => {
        if (selectedItem.id === id) {
          return {
            id,
            quantity: selectedItem.quantity + 1,
          }
        } else return selectedItem
      }),
    }))
  },
  decrementItemQuantity(id) {
    set(({ selectedItems }) => ({
      selectedItems: selectedItems.map((selectedItem) => {
        if (selectedItem.id === id && selectedItem.quantity > 1) {
          return {
            id,
            quantity: selectedItem.quantity - 1,
          }
        } else return selectedItem
      }),
    }))
  },
  orderDetails: {
    customerName: "",
    contactNumber: "",
    destinationAddress: "",
    additionalNotes: "",
  },
  setOrderDetails(newOrderDetails) {
    set(({ orderDetails }) => ({
      orderDetails: {
        customerName: newOrderDetails.customerName ?? orderDetails.customerName,
        contactNumber:
          newOrderDetails.contactNumber ?? orderDetails.contactNumber,
        destinationAddress:
          newOrderDetails.destinationAddress ?? orderDetails.destinationAddress,
        additionalNotes:
          newOrderDetails.additionalNotes ?? orderDetails.additionalNotes,
      },
    }))
  },
}))

import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/utils/api"
import { ProtectedPage } from "@/components/account/ProtectedPage"
import { User } from "firebase/auth"
import { useEffect, useState } from "react"
import { CircledArrowLeft, CrossMark } from "@/components/HeroIcons"
import { useOrderDetailsStore } from "@/stores/orderDetails"
import { BasketItem, CustomerInfo, MenuItem } from "@prisma/client"
import { getQueryKey } from "@trpc/react-query"
import { useIsMutating } from "@tanstack/react-query"
import { LoadingSpinner } from "@/components/loading"
import Image from "next/image"
import { VALID_CONTACT_NUMBER } from "@/utils/validation-patterns"

const editInformationSchema = z.object({
  customerName: z.string().min(1),
  contactNumber: z.string().regex(VALID_CONTACT_NUMBER, {
    message: "Invalid contact number",
  }),
  destinationAddress: z.string().min(1),
})

type editInformationType = z.infer<typeof editInformationSchema>

function EditInformationModal({
  initialValues: { customerName, contactNumber, destinationAddress },
  onSubmitFn,
  onCloseFn,
}: {
  initialValues: editInformationType
  onSubmitFn: (newValues: editInformationType) => void
  onCloseFn: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<editInformationType>({
    resolver: zodResolver(editInformationSchema),
    defaultValues: {
      customerName,
      contactNumber,
      destinationAddress,
    },
  })

  return (
    <div className="fixed inset-0 z-20 bg-black/20">
      <form
        className="bg-white max-w-xl mx-auto mt-24 rounded-2xl px-8 py-6"
        onSubmit={handleSubmit((data) => {
          onSubmitFn(data)
        })}
      >
        <div className="grid grid-cols-[1fr_auto]">
          <div className="font-semibold text-lg">Edit Information</div>
          <button type="button" onClick={onCloseFn}>
            <CrossMark />
          </button>
        </div>
        <div className="px-8 py-4 mb-3">
          <div className="grid mb-3">
            <label className="font-medium">Name</label>
            <input
              type="text"
              className="px-4 py-2 bg-stone-100 rounded-md w-full"
              {...register("customerName")}
            />
            {errors.customerName && (
              <p className="text-red-600 mt-1">
                {errors.customerName.message}.
              </p>
            )}
          </div>
          <div className="grid mb-3">
            <label className="font-medium">Contact number</label>
            <input
              type="text"
              placeholder="09XXYYYZZZZ"
              className="px-4 py-2 bg-stone-100 rounded-md w-full"
              {...register("contactNumber")}
              onChange={(e) => {
                const { value } = e.target
                e.target.value = value.replace(/[^0-9]+/g, "").substring(0, 11)
              }}
            />
            {errors.contactNumber && (
              <p className="text-red-600 mt-1">
                {errors.contactNumber.message}.
              </p>
            )}
          </div>
          <div className="grid">
            <label className="font-medium">Address</label>
            <input
              type="text"
              className="px-4 py-2 bg-stone-100 rounded-md w-full"
              {...register("destinationAddress")}
            />
            {errors.destinationAddress && (
              <p className="text-red-600 mt-1">
                {errors.destinationAddress.message}.
              </p>
            )}
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 transition duration-200 text-white font-semibold px-16 py-2 text-lg rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

function OrderRecipientSection({
  user,
  customerInfo,
}: {
  user: User
  customerInfo: CustomerInfo
}) {
  const {
    setCustomerName,
    setContactNumber,
    setDestinationAddress,
    customerName,
    contactNumber,
    destinationAddress,
  } = useOrderDetailsStore()

  // Copy the values from the API, to our store. We will
  // use these as the initial values for our Edit form.
  useEffect(() => {
    setCustomerName(user.displayName ?? "")
    setContactNumber(customerInfo.defaultContactNumber)
    setDestinationAddress(customerInfo.defaultAddress)
  }, [
    user.displayName,
    customerInfo.defaultContactNumber,
    customerInfo.defaultAddress,
    setCustomerName,
    setContactNumber,
    setDestinationAddress,
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <section className="min-h-[8rem] border border-stone-300 px-6 py-4 rounded-2xl grid grid-cols-[1fr_auto] mb-6">
      <div>
        <p>{customerName}</p>
        <p>{contactNumber}</p>
        <p>{destinationAddress}</p>
      </div>
      <div className="text-right">
        <button
          type="button"
          className="text-emerald-500 font-medium"
          onClick={() => {
            setIsModalVisible(true)
          }}
        >
          Edit
        </button>
      </div>
      {isModalVisible && (
        <EditInformationModal
          initialValues={{
            customerName,
            contactNumber,
            destinationAddress,
          }}
          onSubmitFn={(newOrderDetails) => {
            setCustomerName(newOrderDetails.customerName)
            setContactNumber(newOrderDetails.contactNumber)
            setDestinationAddress(newOrderDetails.destinationAddress)
            setIsModalVisible(false)
          }}
          onCloseFn={() => {
            setIsModalVisible(false)
          }}
        />
      )}
    </section>
  )
}

const additionalNotesSchema = z.object({
  additionalNotes: z.string(),
})

type additionalNotesType = z.infer<typeof additionalNotesSchema>

function AdditionalNotesSection() {
  const { additionalNotes, setAdditionalNotes } = useOrderDetailsStore()

  const {
    reset,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<additionalNotesType>({
    resolver: zodResolver(additionalNotesSchema),
  })

  const [isAdditionalNotesEditable, setIsAdditionalNotesEditable] =
    useState(false)

  return (
    <>
      {isAdditionalNotesEditable ? (
        <form
          className="mb-6"
          onSubmit={handleSubmit((newOrderDetails) => {
            setAdditionalNotes(newOrderDetails.additionalNotes)
            setIsAdditionalNotesEditable(false)
          })}
        >
          <div className="flex justify-between mb-1">
            <p className="font-medium inline-block">Additional Notes</p>
            <div className="flex gap-2 items-center">
              <>
                <button
                  type="button"
                  className="text-emerald-500 font-medium"
                  onClick={() => {
                    reset(() => ({
                      additionalNotes,
                    }))
                    setIsAdditionalNotesEditable(false)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="text-emerald-500 font-medium">
                  Save
                </button>
              </>
            </div>
          </div>
          <textarea
            {...register("additionalNotes")}
            className="px-4 py-2 bg-stone-100 rounded-md w-full h-36 resize-none placeholder:text-stone-500"
            placeholder="Type your notes here"
          ></textarea>
        </form>
      ) : (
        <section className="mb-6">
          <div className="flex justify-between mb-1">
            <p className="font-medium inline-block">Additional Notes</p>
            <button
              type="button"
              className="text-emerald-500 font-medium"
              onClick={() => setIsAdditionalNotesEditable(true)}
            >
              Edit
            </button>
          </div>
          <div className="px-4 py-2 bg-stone-100 rounded-md w-full h-36 resize-none">
            {getValues("additionalNotes") === "" ||
            getValues("additionalNotes") === undefined ? (
              <span className="text-stone-500">Type your notes here</span>
            ) : (
              <>{getValues("additionalNotes")}</>
            )}
          </div>
        </section>
      )}
    </>
  )
}

function CheckoutModal({
  cancelFn,
  isDisabled,
}: {
  cancelFn: () => void
  isDisabled: boolean
}) {
  return (
    <div className="fixed inset-0 z-20 bg-black/20 flex justify-center items-center">
      <div className="bg-white max-w-lg w-full rounded-2xl px-8 py-6">
        <p className="text-justify mb-3">
          The following action will create your order, and you will be
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
            type="submit"
            className="px-6 pt-2 pb-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 text-white rounded-md font-medium"
            disabled={isDisabled}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

const paymentMethodSchema = z.object({
  customerName: z.string().min(1),
  contactNumber: z.string().length(11),
  address: z.string().min(1),
  additionalNotes: z.string(),
  selectedItems: z
    .object({
      id: z.number(),
      quantity: z.number(),
    })
    .array(),
  deliveryFee: z.number(),
  paymentMethod: z.union([z.literal("MAYA"), z.literal("GCASH")]),
})

type PaymentMethodType = z.infer<typeof paymentMethodSchema>

function OrderSummarySection() {
  const {
    selectedMenuItemIds,
    customerName,
    contactNumber,
    destinationAddress,
    additionalNotes,
  } = useOrderDetailsStore()
  const {
    isLoading,
    isError,
    data: basketItems,
  } = api.basketItem.getAll.useQuery()

  const {
    reset,
    register,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<PaymentMethodType>({
    resolver: zodResolver(paymentMethodSchema),
  })
  const { mutate: createOrder, isLoading: isCreatingOrder } =
    api.onlineOrder.create.useMutation({
      onSuccess: ({ paymentUrl }) => {
        // When we successfully create an order, extract the generated
        // payment URL and go to that page.
        location.href = paymentUrl
      },
    })

  const deleteMutationKey = getQueryKey(api.basketItem.delete)
  const runningDeleteMutations = useIsMutating(deleteMutationKey)
  const hasPendingDelete = runningDeleteMutations > 0

  // Delivery fee is 80 Pesos.
  const deliveryFee = 80

  useEffect(() => {
    reset(({ paymentMethod }) => ({
      customerName,
      contactNumber,
      address: destinationAddress,
      additionalNotes,
      selectedItems:
        basketItems === undefined
          ? []
          : basketItems
              .filter((basketItem) =>
                selectedMenuItemIds.includes(basketItem.menuItemId)
              )
              .map((basketItem) => ({
                id: basketItem.menuItemId,
                quantity: basketItem.quantity,
              })),
      paymentMethod,
      deliveryFee,
    }))
  }, [
    reset,
    customerName,
    contactNumber,
    destinationAddress,
    additionalNotes,
    basketItems,
    selectedMenuItemIds,
  ])

  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false)

  if (isLoading)
    return (
      <section className="h-[14rem] bg-neutral-100 text-stone-500 flex items-center justify-center">
        Loading ...
      </section>
    )

  if (isError)
    return (
      <section className="h-[14rem] bg-neutral-100 text-stone-500 flex items-center justify-center">
        An error occured.
      </section>
    )

  const subTotal = basketItems
    .filter((basketItem) => selectedMenuItemIds.includes(basketItem.menuItemId))
    .reduce((prev, basketItem) => {
      return prev + basketItem.quantity * basketItem.menuItem.price.toNumber()
    }, 0)

  const subTotalWithDeliveryFee = subTotal + deliveryFee

  return (
    <form
      onSubmit={handleSubmit((formData) => {
        if (!isCheckoutModalVisible) return
        if (formData.selectedItems.length === 0) return

        const [firstItem, ...otherItems] = formData.selectedItems
        createOrder({
          customerName: formData.customerName,
          contactNumber: formData.contactNumber,
          address: formData.address,
          additionalNotes: formData.additionalNotes,
          selectedItems: [firstItem, ...otherItems],
          deliveryFee: formData.deliveryFee,
          paymentMethod: formData.paymentMethod,
        })
      })}
    >
      <div className="border border-stone-300 px-8 py-4 rounded-2xl mb-4">
        <fieldset className="grid">
          <legend className="font-semibold text-lg">Payment Methods</legend>
          <label className="flex gap-2">
            <input type="radio" {...register("paymentMethod")} value="MAYA" />
            <span>Maya</span>
          </label>
          <label className="flex gap-2">
            <input type="radio" {...register("paymentMethod")} value="GCASH" />
            <span>GCash</span>
          </label>
        </fieldset>
        {errors.paymentMethod && (
          <p className="text-red-600">Please choose a payment method.</p>
        )}
      </div>

      <div className="bg-stone-100 mb-3 grid grid-rows-[auto_1fr_auto_auto]">
        <h3 className="px-8 pt-4 pb-3">
          <div className="border-b border-stone-500 pb-2 font-semibold text-lg">
            Order Summary
          </div>
        </h3>
        <div className="px-8 font-medium flex justify-between">
          <p>Items Total</p>
          <p>₱ {subTotal}</p>
        </div>
        <div className="px-8 pb-3 font-medium flex justify-between">
          <p>Delivery fee</p>
          <p>₱ {deliveryFee}</p>
        </div>

        <div className="[background-color:_#d9d9d9] px-8 py-4 flex justify-between font-semibold text-xl">
          <p>Total:</p>
          <p>₱ {subTotalWithDeliveryFee}</p>
        </div>
      </div>

      {basketItems.filter((basketItem) =>
        selectedMenuItemIds.includes(basketItem.menuItemId)
      ).length > 0 && (
        <button
          type="button"
          disabled={isSubmitSuccessful || isCreatingOrder || hasPendingDelete}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 text-white w-full rounded-md py-3 font-semibold text-xl"
          onClick={async () => {
            const isValid = await trigger()
            if (isValid) setIsCheckoutModalVisible(true)
          }}
        >
          Place Order
        </button>
      )}

      <p className="text-stone-500 text-sm mt-3">
        * Order fees are not automatically refundable.
      </p>

      {isCheckoutModalVisible && (
        <CheckoutModal
          isDisabled={isSubmitSuccessful || isCreatingOrder || hasPendingDelete}
          cancelFn={() => setIsCheckoutModalVisible(false)}
        />
      )}
    </form>
  )
}

function SelectedItemsSectionItem({
  basketItem,
}: {
  basketItem: BasketItem & {
    menuItem: MenuItem
  }
}) {
  return (
    <article className="grid grid-cols-[8rem_1fr_6rem_6rem_6rem] gap-4 border-b border-stone-200 h-36 transition duration-200">
      <div>
        <Image
          alt="Adobo"
          src={basketItem.menuItem.imgUrl}
          width={100}
          height={100}
          className="h-full w-36 object-contain"
        />
      </div>
      <div className="flex items-center font-medium">
        {basketItem.menuItem.name}
      </div>
      <div className="flex items-center justify-center font-medium">
        ₱ {basketItem.menuItem.price.toFixed(2)}
      </div>
      <div className="flex items-center justify-center">
        {basketItem.quantity}
      </div>
      <div className="flex items-center justify-center font-medium">
        ₱{" "}
        {(basketItem.menuItem.price.toNumber() * basketItem.quantity).toFixed(
          2
        )}
      </div>
    </article>
  )
}

function SelectedItemsSection() {
  const { selectedMenuItemIds } = useOrderDetailsStore()
  const {
    isLoading,
    isError,
    data: basketItems,
  } = api.basketItem.getAll.useQuery()

  function filterSelectedItems(
    items: (BasketItem & {
      menuItem: MenuItem
    })[]
  ) {
    return items.filter((basketItem) =>
      selectedMenuItemIds.includes(basketItem.menuItemId)
    )
  }

  return (
    <section>
      <div className="grid grid-cols-[8rem_1fr_6rem_6rem_6rem] gap-4 border-b border-stone-200 text-stone-500">
        <div className="text-center">Product</div>
        <div></div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Total</div>
      </div>
      {isLoading ? (
        <div className="mt-6">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {isError ? (
            <div className="text-center mt-6">
              An error occured while fetching items.
            </div>
          ) : (
            <>
              {filterSelectedItems(basketItems).length === 0 ? (
                <div className="text-center mt-6">No items selected</div>
              ) : (
                <>
                  {filterSelectedItems(basketItems).map((basketItem) => {
                    return (
                      <SelectedItemsSectionItem
                        key={basketItem.id}
                        basketItem={basketItem}
                      />
                    )
                  })}
                </>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}

function AuthenticatedPage({ user }: { user: User }) {
  const { data, isLoading, isError } = api.customerInfo.get.useQuery()

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/menu/basket" className="text-emerald-500">
          <CircledArrowLeft />
        </Link>
        <h2 className="font-semibold text-2xl flex items-end">Checkout</h2>
      </div>
      <div className="grid grid-cols-[1fr_20rem] gap-8">
        {/* Left column */}
        <div>
          {isLoading ? (
            <div className="min-h-[8rem] border border-stone-300 px-6 py-4 rounded-2xl mb-6 flex items-center justify-center text-stone-500">
              Loading ...
            </div>
          ) : (
            <>
              {isError ? (
                <div className="min-h-[8rem] border border-stone-300 px-6 py-4 rounded-2xl mb-6 flex items-center justify-center text-stone-500">
                  An error occured while loading customer.
                </div>
              ) : (
                <>
                  {data === null || data === undefined ? (
                    <div className="min-h-[8rem] border border-stone-300 px-6 py-4 rounded-2xl mb-6 flex items-center justify-center text-stone-500">
                      No customer found.
                    </div>
                  ) : (
                    <OrderRecipientSection user={user} customerInfo={data} />
                  )}
                </>
              )}
            </>
          )}
          <AdditionalNotesSection />
          <SelectedItemsSection />
        </div>
        {/* Right column */}
        <div>
          <OrderSummarySection />
        </div>
      </div>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {({ user }) => <AuthenticatedPage user={user} />}
      </ProtectedPage>
    </main>
  )
}

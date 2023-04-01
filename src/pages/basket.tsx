import { api } from "@/utils/api"
import { MenuItem } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useBasketStore } from "@/stores/basket"

function OrderSummarySection() {
  const { selectedItems } = useBasketStore()
  const { data, isLoading, isError } = api.menuItem.getManyById.useQuery({
    ids: selectedItems.flatMap((selectedItem) => selectedItem.id),
  })

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
  if (data === undefined)
    return (
      <section className="h-[14rem] bg-neutral-100 text-stone-500 flex items-center justify-center">
        No data found.
      </section>
    )

  const subTotal = selectedItems.reduce((prev, selectedItem) => {
    const selectedMenuItem = data.find(
      (menuItem) => menuItem.id === selectedItem.id
    )
    if (selectedMenuItem)
      return prev + selectedItem.quantity * selectedMenuItem.price.toNumber()
    return prev
  }, 0)

  return (
    <section>
      <article className="bg-neutral-100 mb-3 grid grid-rows-[auto_1fr_auto_auto] min-h-[14rem]">
        <h3 className="px-8 pt-4 pb-3">
          <div className="border-b border-stone-500 pb-2 font-semibold text-lg">
            Order Summary
          </div>
        </h3>
        <div className="px-8 font-medium flex justify-between">
          <p>Subtotal:</p>
          <p>₱ {subTotal}</p>
        </div>
        <p className="px-8 py-4 grid grid-cols-[1fr_4rem] gap-2">
          <input
            type="text"
            placeholder="Enter a voucher code"
            className="[background-color:_#d9d9d9] placeholder:text-black px-4 py-1 rounded-md w-full"
          />
          <button
            type="button"
            className="bg-red-600 transition duration-200 hover:bg-red-500 text-white rounded-md"
          >
            APPLY
          </button>
        </p>
        <div className="[background-color:_#d9d9d9] px-8 py-4 flex justify-between font-semibold text-xl">
          <p>Total:</p>
          <p>₱ {subTotal}</p>
        </div>
      </article>
      <button
        type="submit"
        className="bg-emerald-500 text-white w-full rounded-md py-3 font-bold text-xl"
      >
        Check Out
      </button>
    </section>
  )
}

function OrderItemsSectionItem({
  selectedItem,
}: {
  selectedItem: { id: number; quantity: number }
}) {
  const { removeItem, incrementItemQuantity, decrementItemQuantity } =
    useBasketStore()
  const {
    data: menuItem,
    isLoading,
    isError,
  } = api.menuItem.getOne.useQuery({
    id: selectedItem.id,
  })

  if (isLoading)
    return (
      <article className="h-36 flex justify-center items-center">
        Loading ...
      </article>
    )

  if (isError)
    return (
      <article className="h-36 flex justify-center items-center">
        Loading ...
      </article>
    )

  if (menuItem === undefined || menuItem === null)
    return (
      <article className="h-36 flex justify-center items-center">
        No data found.
      </article>
    )

  return (
    <article className="grid grid-cols-[8rem_1fr_6rem_6rem_6rem_3rem] gap-4 border-b border-neutral-100 h-36">
      <div>
        <Image
          alt="Adobo"
          src={menuItem.imgUrl}
          width={100}
          height={100}
          className="h-full w-36 object-contain"
        />
      </div>
      <div className="flex items-center font-medium">{menuItem.name}</div>
      <div className="flex items-center justify-center font-medium">
        ₱ {menuItem.price.toFixed(2)}
      </div>
      <div className="flex items-center">
        <div className="[background-color:_#d9d9d9] rounded-full w-full grid grid-cols-[1fr_2rem_1fr]">
          <button
            type="button"
            onClick={() => decrementItemQuantity(selectedItem.id)}
          >
            -
          </button>
          <span className="text-center py-2">{selectedItem.quantity}</span>
          <button
            type="button"
            onClick={() => incrementItemQuantity(selectedItem.id)}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center font-medium">
        ₱ {menuItem.price.toFixed(2)}
      </div>
      <div className="flex items-center">
        <button type="button" onClick={() => removeItem(menuItem.id)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </article>
  )
}

function OrderItemsSection() {
  const { selectedItems } = useBasketStore()
  return (
    <section>
      <div className="grid grid-cols-[8rem_1fr_6rem_6rem_6rem_3rem] gap-4 border-b border-neutral-100 text-stone-500">
        <div className="text-center">Product</div>
        <div></div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Total</div>
        <div></div>
      </div>
      {selectedItems.length === 0 ? (
        <div className="text-center mt-3">No items selected</div>
      ) : (
        <>
          {selectedItems.map((selectedItem) => {
            return (
              <OrderItemsSectionItem
                key={selectedItem.id}
                selectedItem={selectedItem}
              />
            )
          })}
        </>
      )}
    </section>
  )
}

export default function BasketPage() {
  return (
    <main className="max-w-6xl mx-auto w-full px-6 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/menu" className="[color:_#10B981]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Link>
        <h2 className="font-bold text-2xl flex items-end">Basket</h2>
      </div>
      <form className="grid grid-cols-[1fr_20rem] gap-8">
        <OrderItemsSection />
        <OrderSummarySection />
      </form>
    </main>
  )
}

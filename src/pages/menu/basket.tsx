import { api } from "@/utils/api"
import Link from "next/link"
import { useBasketStore } from "@/stores/basket"
import { useSession } from "@/utils/auth"
import { useRouter } from "next/router"
import { OrderItemsSection } from "@/components/menu/OrderItemsSection"
import { CircledArrowLeft } from "@/components/HeroIcons"

function OrderSummarySection() {
  const { selectedItems } = useBasketStore()
  const { data, isLoading, isError } = api.menuItem.getManyById.useQuery({
    ids: selectedItems.flatMap((selectedItem) => selectedItem.id),
  })

  const { isAuthenticated, isLoading: isLoadingSession } = useSession()
  const router = useRouter()

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
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!isAuthenticated) {
          console.log("Unimplemented: checkout without account.")
          return
        }

        router.push("/menu/checkout")
      }}
    >
      <article className="bg-stone-100 mb-3 grid grid-rows-[auto_1fr_auto_auto] min-h-[14rem]">
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
            className="[background-color:_#d9d9d9] placeholder:text-stone-600 px-4 py-2 rounded-md w-full"
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
      {selectedItems.length > 0 && (
        <>
          {isLoadingSession ? (
            <>
              <span className="bg-emerald-300 inline-block text-white w-full rounded-md py-3 font-semibold text-xl text-center">
                <br />
              </span>
            </>
          ) : (
            <button
              type="submit"
              className="bg-emerald-500 disabled:bg-emerald-400 text-white w-full rounded-md py-3 font-semibold text-xl"
            >
              Checkout
            </button>
          )}
        </>
      )}
    </form>
  )
}

export default function BasketPage() {
  return (
    <main className="max-w-6xl mx-auto w-full px-6 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/menu" className="[color:_#10B981]">
          <CircledArrowLeft />
        </Link>
        <h2 className="font-semibold text-2xl flex items-end">Basket</h2>
      </div>
      <div className="grid grid-cols-[1fr_20rem] gap-8">
        <OrderItemsSection />
        <OrderSummarySection />
      </div>
    </main>
  )
}

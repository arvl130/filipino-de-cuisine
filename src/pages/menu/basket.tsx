import { api } from "@/utils/api"
import Link from "next/link"
import { useRouter } from "next/router"
import { BasketItemsSection } from "@/components/menu/OrderItemsSection"
import { CircledArrowLeft } from "@/components/HeroIcons"
import { getQueryKey } from "@trpc/react-query"
import { useIsMutating } from "@tanstack/react-query"
import { ProtectedPage } from "@/components/account/ProtectedPage"
import { useOrderDetailsStore } from "@/stores/orderDetails"
import { getDiscountedPrice } from "@/utils/discounted-price"

function OrderSummarySection() {
  const {
    isLoading,
    isError,
    data: basketItems,
  } = api.basketItem.getAll.useQuery()
  const router = useRouter()

  const deleteMutationKey = getQueryKey(api.basketItem.delete)
  const runningDeleteMutations = useIsMutating(deleteMutationKey)

  const { selectedMenuItemIds } = useOrderDetailsStore()

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

  const selectedBasketItems = basketItems.filter((basketItem) =>
    selectedMenuItemIds.includes(basketItem.menuItemId)
  )
  const subTotal = selectedBasketItems.reduce((prev, basketItem) => {
    const { hasDiscount, originalPrice, discountedPrice } = getDiscountedPrice(
      basketItem.menuItem
    )
    if (hasDiscount) return prev + basketItem.quantity * discountedPrice

    return prev + basketItem.quantity * originalPrice
  }, 0)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        router.push("/menu/checkout")
      }}
    >
      <article className="bg-stone-100 mb-3 grid grid-rows-[auto_1fr_auto_auto]">
        <div className="[background-color:_#d9d9d9] px-8 py-4 flex justify-between font-semibold text-xl min-h-[4rem]">
          <p>Items Total:</p>
          <p>₱ {subTotal}</p>
        </div>
      </article>
      {selectedBasketItems.length > 0 && (
        <button
          type="submit"
          disabled={runningDeleteMutations > 0}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 text-white w-full rounded-md py-3 font-semibold text-xl"
        >
          Checkout
        </button>
      )}
    </form>
  )
}

function BasketItemsShortButtons() {
  const { selectedMenuItemIds, clearMenuItemIds, addMenuItemId } =
    useOrderDetailsStore()
  const { data: basketItems } = api.basketItem.getAll.useQuery()

  if (basketItems === undefined) return <></>

  return (
    <div>
      {selectedMenuItemIds.length > 0 ? (
        <button
          type="button"
          className="border border-neutral-300 px-2 py-1 rounded-md drop-shadow-md bg-white hover:bg-neutral-50 transition duration-200"
          onClick={() => clearMenuItemIds()}
        >
          Clear Selection
        </button>
      ) : (
        <button
          type="button"
          className="border border-neutral-300 px-2 py-1 rounded-md drop-shadow-md bg-white hover:bg-neutral-50 transition duration-200"
          onClick={() => {
            basketItems.forEach((basketItem) =>
              addMenuItemId(basketItem.menuItemId)
            )
          }}
        >
          Select All
        </button>
      )}
    </div>
  )
}

function AuthenticatedPage() {
  return (
    <>
      <div className="grid grid-cols-[1fr_20rem] gap-8 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/menu" className="text-emerald-500">
              <CircledArrowLeft />
            </Link>
            <h2 className="font-semibold text-2xl flex items-end">Basket</h2>
          </div>
          <BasketItemsShortButtons />
        </div>
        <div></div>
      </div>
      <div className="grid grid-cols-[1fr_20rem] gap-8">
        <BasketItemsSection />
        <OrderSummarySection />
      </div>
    </>
  )
}

export default function BasketPage() {
  return (
    <main className="max-w-6xl mx-auto w-full px-6 py-12">
      <ProtectedPage>{() => <AuthenticatedPage />}</ProtectedPage>
    </main>
  )
}

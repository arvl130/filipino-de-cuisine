import { api } from "@/utils/api"
import Link from "next/link"
import { useRouter } from "next/router"
import { BasketItemsSection } from "@/components/menu/OrderItemsSection"
import { CircledArrowLeft } from "@/components/HeroIcons"
import { getQueryKey } from "@trpc/react-query"
import { useIsMutating } from "@tanstack/react-query"
import { ProtectedPage } from "@/components/account/ProtectedPage"

function OrderSummarySection() {
  const {
    isLoading,
    isError,
    data: basketItems,
  } = api.basketItem.getAll.useQuery()
  const router = useRouter()

  const deleteMutationKey = getQueryKey(api.basketItem.delete)
  const runningDeleteMutations = useIsMutating(deleteMutationKey)

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

  const subTotal = basketItems.reduce((prev, basketItem) => {
    return prev + basketItem.quantity * basketItem.menuItem.price.toNumber()
  }, 0)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
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
      {basketItems.length > 0 && (
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

function AuthenticatedPage() {
  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/menu" className="text-emerald-500">
          <CircledArrowLeft />
        </Link>
        <h2 className="font-semibold text-2xl flex items-end">Basket</h2>
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

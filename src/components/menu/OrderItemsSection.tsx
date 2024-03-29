import { api } from "@/utils/api"
import Image from "next/image"
import { CrossMark } from "../HeroIcons"
import { InlineLoadingSpinner, LoadingSpinner } from "../loading"
import { BasketItem, Discount, DiscountItem, MenuItem } from "@prisma/client"
import { useOrderDetailsStore } from "@/stores/orderDetails"
import { getDiscountedPrice } from "@/utils/discounted-price"

function BasketItemsSectionItem({
  basketItem,
}: {
  basketItem: BasketItem & {
    menuItem: MenuItem & {
      discountItems: (DiscountItem & {
        discount: Discount
      })[]
    }
  }
}) {
  const { hasDiscount, originalPrice, discountedPrice } = getDiscountedPrice(
    basketItem.menuItem
  )

  const apiContext = api.useContext()
  const { mutate: deleteBasketItem, isLoading: isDeletingBasketItem } =
    api.basketItem.delete.useMutation({
      onSuccess: async () => {
        await apiContext.basketItem.getAll.invalidate()
        removeMenuItemId(basketItem.menuItemId)
      },
    })

  const { mutate: updateBasketItem } = api.basketItem.update.useMutation({
    onMutate: async (updatedBasketItem) => {
      await apiContext.basketItem.getAll.cancel()
      const prevData = apiContext.basketItem.getAll.getData()
      apiContext.basketItem.getAll.setData(undefined, (old) => {
        // Set the basket items list as empty, if our data
        // has not been loaded yet (undefined).
        //
        // NOTE: Ideally, we should still try to add the
        // updated item in here, even when there is still no
        // data. But that's not possible, because we don't have
        // access to the full item being updated in this context.
        //
        // One solution we can explore is to use dummy data in
        // the missing item fields, but I've opted not to do
        // that for now to keep things simple.
        if (old === undefined) return []

        return old.map((basketItem) => {
          if (basketItem.id === updatedBasketItem.id)
            return {
              id: basketItem.id,
              customerId: basketItem.customerId,
              quantity: updatedBasketItem.quantity,
              menuItemId: basketItem.menuItemId,
              menuItem: basketItem.menuItem,
            }

          return basketItem
        })
      })

      return { prevData }
    },
    onError: (err, updatedBasketItem, ctx) => {
      if (ctx?.prevData)
        apiContext.basketItem.getAll.setData(undefined, ctx.prevData)
    },
    onSettled: () => apiContext.basketItem.getAll.invalidate(),
  })

  const { selectedMenuItemIds, addMenuItemId, removeMenuItemId } =
    useOrderDetailsStore()
  const isItemSelected = selectedMenuItemIds.includes(basketItem.menuItemId)

  return (
    <>
      {/* Desktop */}
      <article
        className={`hidden sm:grid grid-cols-[4rem_8rem_1fr_6rem_6rem_6rem_3rem] gap-4 border-b border-stone-200 h-36 transition duration-200 ${
          isDeletingBasketItem ? "opacity-50" : ""
        }`}
      >
        <div className="flex justify-center items-center">
          <input
            type="checkbox"
            className="h-6 w-6"
            checked={isItemSelected}
            onChange={(e) => {
              if (e.currentTarget.checked) addMenuItemId(basketItem.menuItemId)
              else removeMenuItemId(basketItem.menuItemId)
            }}
          />
        </div>
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
          ₱{" "}
          <>
            {hasDiscount ? (
              <>{discountedPrice.toFixed(2)}</>
            ) : (
              <>{originalPrice.toFixed(2)}</>
            )}
          </>
        </div>
        <div className="flex items-center">
          <div className="bg-stone-200 rounded-full w-full grid grid-cols-[1fr_2rem_1fr]">
            <button
              type="button"
              disabled={isDeletingBasketItem || basketItem.quantity === 1}
              className="disabled:text-stone-400"
              onClick={() =>
                updateBasketItem({
                  id: basketItem.id,
                  quantity: basketItem.quantity - 1,
                })
              }
            >
              -
            </button>
            <span className="text-center py-2">{basketItem.quantity}</span>
            <button
              type="button"
              disabled={isDeletingBasketItem || basketItem.quantity === 15}
              className="disabled:text-stone-400"
              onClick={() =>
                updateBasketItem({
                  id: basketItem.id,
                  quantity: basketItem.quantity + 1,
                })
              }
            >
              +
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center font-medium">
          ₱{" "}
          <>
            {hasDiscount ? (
              <>{(discountedPrice * basketItem.quantity).toFixed(2)}</>
            ) : (
              <>{(originalPrice * basketItem.quantity).toFixed(2)}</>
            )}
          </>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            disabled={isDeletingBasketItem}
            className="disabled:text-stone-300 flex items-center"
            onClick={() =>
              deleteBasketItem({
                id: basketItem.id,
              })
            }
          >
            {isDeletingBasketItem ? <InlineLoadingSpinner /> : <CrossMark />}
          </button>
        </div>
      </article>
      {/* Mobile */}
      <article
        className={`sm:hidden border-b border-stone-200 transition duration-200 pb-3 ${
          isDeletingBasketItem ? "opacity-50" : ""
        }`}
      >
        <div className="grid gap-3 grid-cols-[auto_1fr] items-center mb-3">
          <div>
            <input
              type="checkbox"
              className="h-6 w-6"
              checked={isItemSelected}
              onChange={(e) => {
                if (e.currentTarget.checked)
                  addMenuItemId(basketItem.menuItemId)
                else removeMenuItemId(basketItem.menuItemId)
              }}
            />
          </div>
          <div className="flex justify-center">
            <Image
              alt="Adobo"
              src={basketItem.menuItem.imgUrl}
              width={100}
              height={100}
              className="h-full w-36 object-contain"
            />
          </div>
        </div>
        <div className="flex justify-between mb-3">
          <div className="font-medium">{basketItem.menuItem.name}</div>
          <div className="justify-center font-medium">
            ₱{" "}
            <>
              {hasDiscount ? (
                <>{(discountedPrice * basketItem.quantity).toFixed(2)}</>
              ) : (
                <>{(originalPrice * basketItem.quantity).toFixed(2)}</>
              )}
            </>
          </div>
        </div>
        <div className="flex items-center mb-3">
          <div className="bg-stone-200 rounded-full w-full grid grid-cols-[1fr_2rem_1fr]">
            <button
              type="button"
              disabled={isDeletingBasketItem || basketItem.quantity === 1}
              className="disabled:text-stone-400"
              onClick={() =>
                updateBasketItem({
                  id: basketItem.id,
                  quantity: basketItem.quantity - 1,
                })
              }
            >
              -
            </button>
            <span className="text-center py-2">{basketItem.quantity}</span>
            <button
              type="button"
              disabled={isDeletingBasketItem || basketItem.quantity === 15}
              className="disabled:text-stone-400"
              onClick={() =>
                updateBasketItem({
                  id: basketItem.id,
                  quantity: basketItem.quantity + 1,
                })
              }
            >
              +
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            disabled={isDeletingBasketItem}
            className="disabled:text-stone-300 flex justify-center items-center bg-stone-200 hover:bg-stone-300 transition duration-200 rounded-full w-full py-2 px-4"
            onClick={() =>
              deleteBasketItem({
                id: basketItem.id,
              })
            }
          >
            {isDeletingBasketItem ? (
              <>
                <InlineLoadingSpinner />{" "}
                <span className="text-stone-500">Removing ...</span>
              </>
            ) : (
              <span className="h-8 flex items-center">Remove from Basket</span>
            )}
          </button>
        </div>
      </article>
    </>
  )
}

export function BasketItemsSection() {
  const {
    isLoading,
    isError,
    data: basketItems,
  } = api.basketItem.getAll.useQuery()
  return (
    <section>
      <div className="hidden sm:grid grid-cols-[4rem_8rem_1fr_6rem_6rem_6rem_3rem] gap-4 border-b border-stone-200 text-stone-500">
        <div></div>
        <div className="text-center">Product</div>
        <div></div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Total</div>
        <div></div>
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
              {basketItems.length === 0 ? (
                <div className="text-center mt-6">No items selected</div>
              ) : (
                <>
                  {basketItems.map((basketItem) => {
                    return (
                      <BasketItemsSectionItem
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

import { api } from "@/utils/api"
import Image from "next/image"
import { CrossMark } from "../HeroIcons"
import { InlineLoadingSpinner, LoadingSpinner } from "../loading"
import { BasketItem, MenuItem } from "@prisma/client"

function BasketItemsSectionItem({
  basketItem,
}: {
  basketItem: BasketItem & { menuItem: MenuItem }
}) {
  const apiContext = api.useContext()
  const { mutate: deleteBasketItem, isLoading: isDeletingBasketItem } =
    api.basketItem.delete.useMutation({
      onSuccess: () => apiContext.basketItem.getAll.invalidate(),
    })

  const { mutate: updateBasketItem, isLoading: isUpdatingBasketItem } =
    api.basketItem.update.useMutation({
      onSuccess: () => apiContext.basketItem.getAll.invalidate(),
    })

  return (
    <article
      className={`grid grid-cols-[8rem_1fr_6rem_6rem_6rem_3rem] gap-4 border-b border-stone-200 h-36 transition duration-200 ${
        isDeletingBasketItem ? "opacity-50" : ""
      }`}
    >
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
      <div className="flex items-center">
        <div className="bg-stone-200 rounded-full w-full grid grid-cols-[1fr_2rem_1fr]">
          <button
            type="button"
            disabled={
              isDeletingBasketItem ||
              isUpdatingBasketItem ||
              basketItem.quantity === 1
            }
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
            disabled={
              isDeletingBasketItem ||
              isUpdatingBasketItem ||
              basketItem.quantity === 15
            }
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
        {(basketItem.menuItem.price.toNumber() * basketItem.quantity).toFixed(
          2
        )}
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
      <div className="grid grid-cols-[8rem_1fr_6rem_6rem_6rem_3rem] gap-4 border-b border-stone-200 text-stone-500">
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

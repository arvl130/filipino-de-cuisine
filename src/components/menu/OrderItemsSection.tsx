import { useBasketStore } from "@/stores/basket"
import { api } from "@/utils/api"
import Image from "next/image"
import { CrossMark } from "../HeroIcons"

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
    <article className="grid grid-cols-[8rem_1fr_6rem_6rem_6rem_3rem] gap-4 border-b border-stone-200 h-36">
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
        ₱ {(menuItem.price.toNumber() * selectedItem.quantity).toFixed(2)}
      </div>
      <div className="flex items-center">
        <button type="button" onClick={() => removeItem(menuItem.id)}>
          <CrossMark />
        </button>
      </div>
    </article>
  )
}

export function OrderItemsSection() {
  const { selectedItems } = useBasketStore()
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

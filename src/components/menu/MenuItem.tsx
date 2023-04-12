import { useBasketStore } from "@/stores/basket"
import { MenuItem } from "@prisma/client"
import Image from "next/image"

export function MenuItem({ menuItem }: { menuItem: MenuItem }) {
  const { selectedItems, addItem, removeItem } = useBasketStore()

  return (
    <article className="relative w-[min(100%,_20rem)] grid grid-rows-[auto_1fr]">
      <div className="h-24 z-[1]">
        <Image
          src={menuItem.imgUrl}
          height={200}
          width={200}
          alt={menuItem.name}
          className="object-contain rounded-full w-[min(100%,_12rem)] aspect-square left-0 right-0 mx-auto"
        />
      </div>
      <div className="border [border-color:_#78716C] rounded-2xl px-6 pt-24 pb-8 text-center grid grid-rows-[auto_auto_1fr_auto_auto]">
        <h3 className="font-bold text-2xl pt-3">{menuItem.name}</h3>
        <p className="[color:_#78716C] my-1">{menuItem.category}</p>
        <p className="mb-5 flex items-center">{menuItem.description}</p>
        <p className="font-bold text-red-500 text-3xl">
          ₱ {menuItem.price.toNumber()}
        </p>
      </div>
      <div className="text-center">
        {selectedItems.some(
          (selectedItem) => selectedItem.id === menuItem.id
        ) ? (
          <button
            onClick={() => removeItem(menuItem.id)}
            className="inline-block bg-red-500 text-white w-36 px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() => addItem(menuItem.id, 1)}
            className="inline-block bg-emerald-500 hover:bg-emerald-400 transition duration-200 w-36 text-white px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5"
          >
            Add to Basket
          </button>
        )}
      </div>
    </article>
  )
}

import Image from "next/image"
import Link from "next/link"

export function MenuItem({
  menuItem,
}: {
  menuItem: {
    name: string
    description: string
    category: string
    price: number
    imageUrl: string
  }
}) {
  return (
    <article className="relative w-[20rem] grid grid-rows-[auto_1fr]">
      <div className="h-24 z-[1]">
        <Image
          src={menuItem.imageUrl}
          height={200}
          width={200}
          alt={menuItem.name}
          className="object-cover rounded-full h-48 left-0 right-0 mx-auto"
        />
      </div>
      <div className="border [border-color:_#78716C] rounded-2xl px-6 pt-24 pb-8 text-center grid grid-rows-[auto_auto_1fr_auto_auto]">
        <h3 className="font-bold text-2xl pt-3">{menuItem.name}</h3>
        <p className="[color:_#78716C] my-1">{menuItem.category}</p>
        <p className="mb-5 flex items-center">{menuItem.description}</p>
        <p className="font-bold text-red-500 text-3xl">₱ {menuItem.price}</p>
      </div>
      <div className="text-center">
        <Link
          href="/"
          className="inline-block [background-color:_#10B981] text-white px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5"
        >
          Add to Basket
        </Link>
      </div>
    </article>
  )
}

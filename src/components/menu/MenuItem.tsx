import { api } from "@/utils/api"
import { useSession } from "@/utils/auth"
import { getDiscountedPrice } from "@/utils/discounted-price"
import { Discount, DiscountItem, MenuItem } from "@prisma/client"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect } from "react"

function Button({
  menuItemId,
  isActive,
}: {
  menuItemId: number
  isActive: boolean
}) {
  const { isLoading: isLoadingSession, isAuthenticated } = useSession()
  const {
    isLoading: isLoadingBasketItems,
    isError: isErrorBasketItems,
    data: basketItems,
  } = api.basketItem.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  })
  const router = useRouter()

  const apiContext = api.useContext()
  const { mutate: createBasketItem, isLoading: isCreatingBasketItem } =
    api.basketItem.create.useMutation({
      onSuccess: () => apiContext.basketItem.getAll.invalidate(),
    })
  const { mutate: removeMenuItem, isLoading: isDeletingBasketItem } =
    api.basketItem.removeMenuItem.useMutation({
      onSuccess: () => apiContext.basketItem.getAll.invalidate(),
    })

  if (isLoadingSession)
    return (
      <span className="inline-block bg-emerald-300 transition duration-200 w-36 text-white px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5">
        <br />
      </span>
    )

  if (isAuthenticated) {
    if (isLoadingBasketItems)
      return (
        <span className="inline-block bg-emerald-300 transition duration-200 w-36 text-white px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5">
          <br />
        </span>
      )

    if (isErrorBasketItems)
      return (
        <span className="inline-block bg-emerald-300 transition duration-200 w-36 text-white px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5">
          Basket error
        </span>
      )

    if (!isActive)
      return (
        <span className="inline-block bg-emerald-300 transition duration-200 w-36 text-white px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5">
          Not available
        </span>
      )

    const isItemInBasket = basketItems.some(
      (basketItem) => basketItem.menuItemId === menuItemId
    )

    if (isItemInBasket)
      return (
        <button
          onClick={() =>
            removeMenuItem({
              menuItemId,
            })
          }
          disabled={isDeletingBasketItem}
          className="inline-block bg-red-500 hover:bg-red-400 disabled:bg-red-300 transition duration-200 text-white w-36 px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5"
        >
          {isDeletingBasketItem ? <>Removing ...</> : <>Remove</>}
        </button>
      )
    else
      return (
        <button
          onClick={() =>
            createBasketItem({
              menuItemId,
            })
          }
          disabled={isCreatingBasketItem}
          className="inline-block bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 w-36 text-white px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5"
        >
          {isCreatingBasketItem ? <>Adding ...</> : <>Add to Basket</>}
        </button>
      )
  } else {
    return (
      <button
        onClick={() => {
          router.push({
            pathname: "/signin",
            query: {
              returnUrl: "/menu",
            },
          })
        }}
        className="inline-block bg-emerald-500 hover:bg-emerald-400 transition duration-200 w-36 text-white px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5"
      >
        Add to Basket
      </button>
    )
  }
}

function ItemPrice({
  menuItem,
}: {
  menuItem: MenuItem & {
    discountItems: (DiscountItem & {
      discount: Discount
    })[]
  }
}) {
  useEffect(() => {
    console.log("Received menuItem:", menuItem)
  }, [menuItem])

  const { hasDiscount, originalPrice, discountedPrice } =
    getDiscountedPrice(menuItem)

  if (hasDiscount)
    return (
      <>
        <p>
          <span className="font-bold text-red-500 text-3xl">
            ₱ {discountedPrice}{" "}
          </span>

          <sup className=" text-red-500 text-sm">
            <s className="decoration-1">₱ {originalPrice}</s>
          </sup>
        </p>
      </>
    )

  return (
    <p className="font-bold text-red-500 text-3xl">
      ₱ {menuItem.price.toNumber()}
    </p>
  )
}

export function MenuItemSkeleton() {
  return (
    <article className="relative w-[min(100%,_20rem)] grid grid-rows-[auto_1fr]">
      <div className="h-24 z-[1]">
        <div className="object-contain rounded-full w-[12rem] aspect-square left-0 right-0 mx-auto p-4">
          <div className="bg-zinc-100 w-full h-full rounded-full"></div>
        </div>
      </div>
      <div className="min-h-[26rem] border [border-color:_#78716C] rounded-2xl px-6 pt-24 pb-8 text-center grid grid-rows-[auto_auto_1fr_auto_auto]">
        <h3 className="font-bold text-2xl pt-3">
          <span className="inline-block w-[10rem] bg-zinc-100 rounded-md">
            <br />
          </span>
        </h3>
        <p className="[color:_#78716C] my-1">
          <span className="inline-block w-[4rem] bg-zinc-100 rounded-md">
            <br />
          </span>
        </p>
        <p className="mb-5 flex items-center justify-center flex-col gap-2">
          <span className="inline-block w-[14rem] bg-zinc-100 rounded-md">
            <br />
          </span>
          <span className="inline-block w-[12rem] bg-zinc-100 rounded-md">
            <br />
          </span>
          <span className="inline-block w-[10rem] bg-zinc-100 rounded-md">
            <br />
          </span>
          <span className="inline-block w-[12rem] bg-zinc-100 rounded-md">
            <br />
          </span>
        </p>
        <p className="font-bold text-red-500 text-3xl">
          <span className="inline-block w-[5ch] bg-zinc-100 rounded-md">
            <br />
          </span>
        </p>
      </div>
      <div className="text-center">
        <span className="inline-block bg-emerald-300 transition duration-200 w-36 text-white px-3 pb-1 pt-2 font-bold text-lg rounded-md -translate-y-5">
          <br />
        </span>
      </div>
    </article>
  )
}

export function MenuItem({
  menuItem,
}: {
  menuItem: MenuItem & {
    discountItems: (DiscountItem & {
      discount: Discount
    })[]
  }
}) {
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
      <div className="min-h-[26rem] border [border-color:_#78716C] rounded-2xl px-6 pt-24 pb-8 text-center grid grid-rows-[auto_auto_1fr_auto_auto]">
        <h3 className="font-bold text-2xl pt-3">{menuItem.name}</h3>
        <p className="[color:_#78716C] my-1">{menuItem.category}</p>
        <p className="mb-5 flex items-center">{menuItem.description}</p>
        <ItemPrice menuItem={menuItem} />
      </div>
      <div className="text-center">
        <Button menuItemId={menuItem.id} isActive={menuItem.isActive} />
      </div>
    </article>
  )
}

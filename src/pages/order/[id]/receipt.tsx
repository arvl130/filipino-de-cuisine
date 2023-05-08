import { CircledArrowLeft } from "@/components/HeroIcons"
import { ProtectedPage } from "@/components/account/ProtectedPage"
import { LoadingSpinner } from "@/components/loading"
import { api } from "@/utils/api"
import { OnlineOrder, Order, OrderItem } from "@prisma/client"
import { User } from "firebase/auth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

function MerchantSection() {
  return (
    <section className="flex justify-between border-2 border-emerald-500 px-4 py-6 rounded-lg mb-5">
      <div className="flex items-center gap-4">
        <Image
          src="/assets/website-logo.png"
          alt="Logo of Filipino de Cuisine"
          height={100}
          width={100}
          className="inline-block"
        />
        <div>
          <p className="text-center font-inika text-xl font-bold">
            <span className="uppercase [color:_#DC2626]">Filipino</span>{" "}
            <span className="uppercase [color:_#78716C]">de Cuisine</span>
          </p>
          <p>filipinodecuisine@gmail.com</p>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <p>673 Quirino Highway, San Bartolome</p>
        <p>Novaliches, Quezon City</p>
        <p>(02) 8806-3049</p>
      </div>
    </section>
  )
}

function PaymentType({ paymentIntentId }: { paymentIntentId: string }) {
  const { data, isLoading, isError } = api.payment.getPaymentIntent.useQuery({
    id: paymentIntentId,
  })

  if (isLoading) return <p>Payment Type: ...</p>
  if (isError)
    return (
      <p>
        Payment Type: <span className="text-red-500">error occured</span>
      </p>
    )

  if (
    data.data.attributes.payments[0].attributes.source.type !== "gcash" &&
    data.data.attributes.payments[0].attributes.source.type !== "paymaya"
  )
    return (
      <p>
        Payment Type: <span className="text-red-500">invalid type</span>
      </p>
    )

  if (data.data.attributes.payments[0].attributes.source.type === "gcash")
    return <p>Payment Type: GCASH</p>

  if (data.data.attributes.payments[0].attributes.source.type === "paymaya")
    return <p>Payment Type: MAYA</p>

  return (
    <p>
      Payment Type: <span className="text-red-500">reached never state</span>
    </p>
  )
}

function BillingSection({
  onlineOrder,
}: {
  onlineOrder: OnlineOrder & {
    order: Order & {
      orderItems: OrderItem[]
    }
  }
}) {
  function formattedDate(givenDate: Date) {
    const year = givenDate.getFullYear()
    const month = givenDate.getMonth() + 1
    const date = givenDate.getDate()

    const monthStr = month < 10 ? `0${month}` : `${month}`
    const dateStr = date < 10 ? `0${date}` : `${date}`

    return `${monthStr}-${dateStr}-${year}`
  }

  function formattedTime(date: Date) {
    const hours =
      date.getHours() > 12 ? `${date.getHours() - 12}` : `${date.getHours()}`
    const minutesInt = date.getMinutes()
    const minutes = minutesInt > 9 ? `${minutesInt}` : `0${minutesInt}`
    const ampm = date.getHours() > 11 ? "PM" : "AM"

    return `${hours}:${minutes} ${ampm}`
  }

  return (
    <section className="px-6 py-5 rounded-lg flex justify-between bg-neutral-100 mb-4">
      <div>
        <p className="font-semibold text-lg">Billed to</p>
        <p>{onlineOrder.order.customerName}</p>
        <p>{onlineOrder.contactNumber}</p>
        <p>{onlineOrder.address}</p>
      </div>
      <div className="text-right">
        <p className="font-medium text-lg">Order ID: 0019</p>
        <p>Date: {formattedDate(onlineOrder.order.createdAt)}</p>
        <p>Time: {formattedTime(onlineOrder.order.createdAt)}</p>
        <PaymentType paymentIntentId={onlineOrder.paymentIntentId} />
      </div>
    </section>
  )
}

function ReadOnlyOrderItemsSectionItem({
  selectedItem,
}: {
  selectedItem: { id: number; quantity: number }
}) {
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
        <LoadingSpinner />
      </article>
    )

  if (isError)
    return (
      <article className="h-36 flex justify-center items-center">
        An error occured while loading menu item.
      </article>
    )

  if (menuItem === undefined || menuItem === null)
    return (
      <article className="h-36 flex justify-center items-center">
        No data found.
      </article>
    )

  return (
    <article className="grid grid-cols-[8rem_1fr_6rem_6rem_6rem] gap-4 border-b border-stone-200 h-36">
      <div>
        <Image
          alt="Adobo"
          src={menuItem.imgUrl}
          width={100}
          height={100}
          className="h-full w-36 object-contain"
        />
      </div>
      <div className="flex items-center font-medium px-6">{menuItem.name}</div>
      <div className="flex items-center justify-center font-medium">
        ₱ {menuItem.price.toFixed(2)}
      </div>
      <div className="flex items-center justify-center">
        {selectedItem.quantity}
      </div>
      <div className="flex items-center justify-center font-medium">
        ₱ {(menuItem.price.toNumber() * selectedItem.quantity).toFixed(2)}
      </div>
    </article>
  )
}

export function ReadOnlyOrderItemsSection({
  onlineOrder,
}: {
  onlineOrder: OnlineOrder & {
    order: Order & {
      orderItems: OrderItem[]
    }
  }
}) {
  const subTotal = onlineOrder.order.orderItems.reduce((prev, selectedItem) => {
    return prev + selectedItem.price.toNumber()
  }, 0)
  const subTotalWithDeliveryFee = subTotal + onlineOrder.deliveryFee.toNumber()

  return (
    <section>
      <div className="grid grid-cols-[8rem_1fr_6rem_6rem_6rem] gap-4 border-b border-stone-200 text-stone-500">
        <div className="text-center">Product</div>
        <div></div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-center">Total</div>
      </div>
      {onlineOrder.order.orderItems.length === 0 ? (
        <div className="text-center mt-3">No items selected</div>
      ) : (
        <>
          {onlineOrder.order.orderItems.map((orderItem) => {
            return (
              <ReadOnlyOrderItemsSectionItem
                key={orderItem.id}
                selectedItem={{
                  id: orderItem.menuItemId,
                  quantity: orderItem.quantity,
                }}
              />
            )
          })}
        </>
      )}
      <div className="flex justify-between px-6 pt-3">
        <p className="font-semibold">Items Subtotal</p>
        <p className="font-semibold">₱ {(subTotal * 0.88).toFixed(2)}</p>
      </div>
      <div className="flex justify-between px-6">
        <p className="font-semibold">Delivery Fee</p>
        <p className="font-semibold">
          ₱ {(onlineOrder.deliveryFee.toNumber() * 0.88).toFixed(2)}
        </p>
      </div>
      <div className="flex justify-between px-6">
        <p className="font-semibold">Amount Due</p>
        <p className="font-semibold">
          ₱ {(subTotalWithDeliveryFee * 0.88).toFixed(2)}
        </p>
      </div>
      <div className="flex justify-between px-6">
        <p className="font-semibold">VAT (12%)</p>
        <p className="font-semibold">
          ₱ {(subTotalWithDeliveryFee * 0.12).toFixed(2)}
        </p>
      </div>
      <div className="flex justify-between px-6 pt-3 text-xl">
        <p className="font-semibold">TOTAL</p>
        <p className="font-semibold">₱ {subTotalWithDeliveryFee.toFixed(2)}</p>
      </div>
    </section>
  )
}

function TallySection() {
  return <section className="mt-4">hi</section>
}

function AuthenticatedPage({}: { user: User }) {
  const { query, isReady } = useRouter()
  const { data, isLoading, isError } = api.onlineOrder.getOne.useQuery(
    {
      id: parseInt(query.id as string),
    },
    {
      enabled: isReady && typeof query.id === "string",
    }
  )

  if (isLoading) return <LoadingSpinner />
  if (isError) return <div>An error occured</div>
  if (!data) return <div>No order found.</div>

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/order/${query.id}`} className="text-emerald-500">
          <CircledArrowLeft />
        </Link>
        <h2 className="font-semibold text-2xl flex items-end">Receipt</h2>
      </div>
      <div className="px-12">
        <MerchantSection />
        <BillingSection onlineOrder={data} />
        <ReadOnlyOrderItemsSection onlineOrder={data} />
      </div>
    </div>
  )
}

export default function ViewReceiptPage() {
  return (
    <main className="max-w-5xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {({ user }) => <AuthenticatedPage user={user} />}
      </ProtectedPage>
    </main>
  )
}

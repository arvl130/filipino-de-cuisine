import { CircledArrowLeft } from "@/components/HeroIcons"
import { ProtectedPage } from "@/components/account/ProtectedPage"
import { PaymentIntent } from "@/server/payment-gateway"
import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { OnlineOrder, Order, OrderItem } from "@prisma/client"
import { User } from "firebase/auth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { z } from "zod"

function SourceStatus({
  sourceId,
  paymentIntentId,
}: {
  sourceId: string
  paymentIntentId: string
}) {
  const { data, isLoading, isError } = api.payment.getSource.useQuery({
    id: sourceId,
  })
  const { refetch } = api.payment.getPaymentIntent.useQuery({
    id: paymentIntentId,
  })

  const { mutate: refreshPaymentIntent } =
    api.payment.refreshPaymentIntent.useMutation({
      onSuccess: () => refetch(),
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<paymentMethodType>({
    resolver: zodResolver(paymentMethodSchema),
  })

  if (isLoading) return <div>Loading ...</div>
  if (isError) return <div>An error occured.</div>
  if (!data) return <div>No source found.</div>

  return (
    <div>
      {data.data.attributes.status === "expired" && (
        <form
          onSubmit={handleSubmit((formData) =>
            refreshPaymentIntent({
              id: data.data.id,
              paymentMethod: formData.paymentMethod,
            })
          )}
        >
          <p className="mb-1">
            The payment session for this order expired. Please choose a new
            payment method.
          </p>
          <div className="grid mb-1">
            <label className="flex gap-3">
              <input
                type="radio"
                value="GCASH"
                {...register("paymentMethod")}
              />
              <span>GCash</span>
            </label>
            <label className="flex gap-3">
              <input type="radio" value="MAYA" {...register("paymentMethod")} />
              <span>Maya</span>
            </label>
          </div>
          <div className="text-right font-medium">
            <button
              type="submit"
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-400 transition duration-200"
            >
              Proceed
            </button>
          </div>
        </form>
      )}
      {data.data.attributes.status === "pending" && (
        <div>
          <p className="mb-1">
            The payment for this order is still pending. Click the button below
            to continue the payment process.
          </p>
          <div className="text-right">
            <a
              href={data.data.attributes.redirect.checkout_url}
              className="inline-block bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-400 transition duration-200"
            >
              Continue
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

const paymentMethodSchema = z.object({
  paymentMethod: z.union([z.literal("MAYA"), z.literal("GCASH")]),
})

type paymentMethodType = z.infer<typeof paymentMethodSchema>

function PaymentIntentStatus({ id }: { id: string }) {
  const { data, isLoading, isError, refetch } =
    api.payment.getPaymentIntent.useQuery({
      id,
    })

  const { mutate: refreshPaymentIntent } =
    api.payment.refreshPaymentIntent.useMutation({
      onSuccess: () => refetch(),
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<paymentMethodType>({
    resolver: zodResolver(paymentMethodSchema),
  })

  if (isLoading) return <div>Loading ...</div>
  if (isError) return <div>An error occured</div>
  if (!data) return <div>No payment intent found.</div>

  return (
    <div>
      <h2 className="font-semibold text-2xl mb-3">Payment Status</h2>
      <div className="max-w-xl mx-auto bg-stone-100 px-6 py-4 rounded-lg">
        {data.data.attributes.status === "succeeded" && (
          <p className="text-center">
            Payment succeeded. Try refreshing this page.
          </p>
        )}
        {data.data.attributes.status === "processing" && (
          <p className="text-center">
            We are still processing your payment. Please return in a few moment.
          </p>
        )}
        {data.data.attributes.status === "awaiting_next_action" && (
          <>
            {data.data.attributes.next_action === null ? (
              <p className="text-center">
                Awaiting next action, but no next action could be found.
              </p>
            ) : (
              <SourceStatus
                sourceId={
                  data.data.attributes.next_action.redirect.url.split("id=")[1]
                }
                paymentIntentId={data.data.id}
              />
            )}
          </>
        )}
        {data.data.attributes.status === "awaiting_payment_method" && (
          <form
            onSubmit={handleSubmit((formData) =>
              refreshPaymentIntent({
                id: data.data.id,
                paymentMethod: formData.paymentMethod,
              })
            )}
          >
            <p className="mb-1">
              No payment has yet been made for this order. Please choose a
              payment method.
            </p>
            <div className="grid mb-1">
              <label className="flex gap-3">
                <input
                  type="radio"
                  value="GCASH"
                  {...register("paymentMethod")}
                />
                <span>GCash</span>
              </label>
              <label className="flex gap-3">
                <input
                  type="radio"
                  value="MAYA"
                  {...register("paymentMethod")}
                />
                <span>Maya</span>
              </label>
            </div>
            <div className="text-right font-medium">
              <button
                type="submit"
                className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-400 transition duration-200"
              >
                Proceed
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function OrderStatusSection({
  onlineOrder,
}: {
  onlineOrder: OnlineOrder & {
    order: Order & {
      orderItems: OrderItem[]
    }
  }
}) {
  return (
    <section
      className={`grid ${
        onlineOrder.deliveryStatus !== "Cancelled" ? "grid-cols-4" : ""
      } text-center pt-6 pb-12 px-12`}
    >
      {onlineOrder.deliveryStatus === "Pending" && (
        <>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 rounded-l-md w-full flex items-center">
                <div className="h-1 w-full bg-red-600 rounded-l"></div>
              </div>
              <div className="bg-red-600 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/confirmed.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-20 w-20"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Order Confirmed</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full flex items-center"></div>
              <div className="bg-stone-500 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/preparing.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-16 w-16"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Preparing in the Kitchen</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full flex items-center"></div>
              <div className="bg-stone-500 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/on-the-way.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-14 w-14"
                />
              </div>
            </div>
            <div className="font-medium mt-1">On the way</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full rounded-r-md flex items-center"></div>
              <div className="bg-stone-500 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/delivered.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-14 w-14"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Order Delivered</div>
          </div>
        </>
      )}
      {onlineOrder.deliveryStatus === "Preparing" && (
        <>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 rounded-l-md w-full flex items-center">
                <div className="h-1 w-full bg-red-600 rounded-l"></div>
              </div>
              <div className="bg-red-600 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/confirmed.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-20 w-20"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Order Confirmed</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full flex items-center">
                <div className="h-1 w-full bg-red-600"></div>
              </div>
              <div className="bg-red-600 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/preparing.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-16 w-16"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Preparing in the Kitchen</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full flex items-center"></div>
              <div className="bg-stone-500 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/on-the-way.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-14 w-14"
                />
              </div>
            </div>
            <div className="font-medium mt-1">On the way</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full rounded-r-md flex items-center"></div>
              <div className="bg-stone-500 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/delivered.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-14 w-14"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Order Delivered</div>
          </div>
        </>
      )}
      {onlineOrder.deliveryStatus === "OutForDelivery" && (
        <>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 rounded-l-md w-full flex items-center">
                <div className="h-1 w-full bg-red-600 rounded-l"></div>
              </div>
              <div className="bg-red-600 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/confirmed.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-20 w-20"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Order Confirmed</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full flex items-center">
                <div className="h-1 w-full bg-red-600"></div>
              </div>
              <div className="bg-red-600 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/preparing.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-16 w-16"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Preparing in the Kitchen</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full flex items-center">
                <div className="h-1 w-full bg-red-600"></div>
              </div>
              <div className="bg-red-600 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/on-the-way.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-14 w-14"
                />
              </div>
            </div>
            <div className="font-medium mt-1">On the way</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full rounded-r-md flex items-center"></div>
              <div className="bg-stone-500 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/delivered.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-14 w-14"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Order Delivered</div>
          </div>
        </>
      )}
      {onlineOrder.deliveryStatus === "Received" && (
        <>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 rounded-l-md w-full flex items-center">
                <div className="h-1 w-full bg-red-600 rounded-l"></div>
              </div>
              <div className="bg-red-600 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/confirmed.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-20 w-20"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Order Confirmed</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full flex items-center">
                <div className="h-1 w-full bg-red-600"></div>
              </div>
              <div className="bg-red-600 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/preparing.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-16 w-16"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Preparing in the Kitchen</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full flex items-center">
                <div className="h-1 w-full bg-red-600"></div>
              </div>
              <div className="bg-red-600 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/on-the-way.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-14 w-14"
                />
              </div>
            </div>
            <div className="font-medium mt-1">On the way</div>
          </div>
          <div>
            <div className="h-24 flex items-center relative">
              <div className="bg-stone-500 h-2 w-full rounded-r-md flex items-center">
                <div className="h-1 w-full bg-red-600 rounded-r"></div>
              </div>
              <div className="bg-red-600 h-24 w-24 absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center text-white font-medium">
                <Image
                  src="/assets/orders/delivered.png"
                  alt="idk"
                  height={100}
                  width={100}
                  className="h-14 w-14"
                />
              </div>
            </div>
            <div className="font-medium mt-1">Order Delivered</div>
          </div>
        </>
      )}
      {onlineOrder.deliveryStatus === "Cancelled" && (
        <p className="text-center">This order has been cancelled.</p>
      )}
    </section>
  )
}

export function OrderItemsSectionItem({
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

function OrderItemsSection({
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
    <section className="max-w-4xl mx-auto">
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
              <OrderItemsSectionItem
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
      <div className="flex justify-between px-6 py-3">
        <p className="font-semibold">Delivery Fee</p>
        <p className="font-semibold">
          ₱ {onlineOrder.deliveryFee.toNumber().toFixed(2)}
        </p>
      </div>
      <div className="flex justify-between px-6 py-3 text-xl">
        <p className="font-semibold">TOTAL</p>
        <p className="font-semibold">₱ {subTotalWithDeliveryFee.toFixed(2)}</p>
      </div>
    </section>
  )
}

function CancelOrderSection({
  onlineOrder,
}: {
  onlineOrder: OnlineOrder & {
    order: Order & {
      orderItems: OrderItem[]
    }
  }
}) {
  const { refetch } = api.onlineOrder.getOne.useQuery({
    id: onlineOrder.id,
  })
  const { mutate: cancelOrder, isLoading } = api.onlineOrder.cancel.useMutation(
    {
      onSuccess: () => refetch(),
    }
  )

  if (onlineOrder.deliveryStatus !== "Pending") return <></>

  return (
    <section className="text-right max-w-4xl mx-auto pt-3">
      <p className="mb-1">
        <button
          type="button"
          className="bg-red-600 hover:bg-red-500 disabled:bg-red-300 transition duration-200 text-white px-4 py-2 rounded-lg font-semibold text-lg"
          disabled={isLoading}
          onClick={() =>
            cancelOrder({
              id: onlineOrder.id,
            })
          }
        >
          Cancel Order
        </button>
      </p>
      <p className="text-stone-500 text-sm">
        * You will not be able to cancel once the order is being prepared.
      </p>
    </section>
  )
}

function DeliveryStatus() {
  const { query } = useRouter()
  const { data, isLoading, isError } = api.onlineOrder.getOne.useQuery(
    {
      id: parseInt(query.id as string),
    },
    {
      enabled: typeof query.id === "string",
    }
  )

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/menu/basket" className="text-emerald-500">
          <CircledArrowLeft />
        </Link>
        <h2 className="font-semibold text-2xl flex items-end">
          Delivery Status
        </h2>
      </div>
      <p className="px-12">Order ID: {query.id}</p>

      {isLoading ? (
        <>Loading ...</>
      ) : (
        <>
          {isError ? (
            <>An error occured while loading order.</>
          ) : (
            <>
              {data ? (
                <>
                  <OrderStatusSection onlineOrder={data} />
                  <OrderItemsSection onlineOrder={data} />
                  <CancelOrderSection onlineOrder={data} />
                </>
              ) : (
                <>No order found.</>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

function AuthenticatedPage({ user }: { user: User }) {
  const { query, isReady } = useRouter()
  const { data, isLoading, isError } = api.onlineOrder.getOne.useQuery(
    {
      id: parseInt(query.id as string),
    },
    {
      enabled: isReady && typeof query.id === "string",
    }
  )

  if (isLoading) return <div>Loading ...</div>
  if (isError) return <div>An error occured</div>
  if (!data) return <div>No order found.</div>

  return (
    <div>
      {data.order.paymentStatus === "Pending" && (
        <PaymentIntentStatus id={data.paymentIntentId} />
      )}
      {data.order.paymentStatus === "Fulfilled" && <DeliveryStatus />}
    </div>
  )
}

export default function ViewOrderPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {(user) => <AuthenticatedPage user={user} />}
      </ProtectedPage>
    </main>
  )
}

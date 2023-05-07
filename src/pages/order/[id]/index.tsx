import { CircledArrowLeft } from "@/components/HeroIcons"
import { ProtectedPage } from "@/components/account/ProtectedPage"
import { LoadingSpinner } from "@/components/loading"
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
  orderId,
}: {
  sourceId: string
  paymentIntentId: string
  orderId: number
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

  if (isLoading) return <LoadingSpinner />
  if (isError) return <div>An error occured.</div>
  if (!data) return <div>No source found.</div>

  return (
    <div>
      {data.data.attributes.status === "expired" && (
        <form
          onSubmit={handleSubmit((formData) =>
            refreshPaymentIntent({
              id: paymentIntentId,
              paymentMethod: formData.paymentMethod,
              paymentFor: "ORDER",
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
          <div className="flex justify-end gap-3">
            <CancelPaymentButton orderId={orderId} />
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

function CancelPaymentButton({ orderId }: { orderId: number }) {
  const { refetch, isLoading: isLoadingOrder } =
    api.onlineOrder.getOne.useQuery({
      id: orderId,
    })

  const { mutate: cancelPayment, isLoading } =
    api.onlineOrder.cancelPayment.useMutation({
      onSuccess: () => refetch(),
    })

  return (
    <button
      type="button"
      className="bg-red-500 hover:bg-red-400 transition duration-200 text-white px-4 py-2 rounded-md disabled:bg-red-300"
      disabled={isLoadingOrder || isLoading}
      onClick={() =>
        cancelPayment({
          id: orderId,
        })
      }
    >
      Cancel Order
    </button>
  )
}

const paymentMethodSchema = z.object({
  paymentMethod: z.union([z.literal("MAYA"), z.literal("GCASH")]),
})

type paymentMethodType = z.infer<typeof paymentMethodSchema>

function PaymentStatusSection({
  id,
  orderId,
}: {
  id: string
  orderId: number
}) {
  const { data, isLoading, isError, refetch } =
    api.payment.getPaymentIntent.useQuery({
      id,
    })

  const { refetch: refetchOrder, isRefetching } =
    api.onlineOrder.getOne.useQuery({
      id: orderId,
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

  if (isLoading) return <LoadingSpinner />
  if (isError) return <div>An error occured</div>
  if (!data) return <div>No payment intent found.</div>

  return (
    <section className="max-w-xl mx-auto bg-stone-100 px-6 py-4 mt-6 mb-8 rounded-lg">
      {data.data.attributes.status === "succeeded" && (
        <div className="text-center">
          <p className="mb-1">Payment succeeded. Try refreshing this page.</p>
          <button
            type="button"
            disabled={isRefetching}
            className="px-4 pb-2 pt-3 w-32 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-300 transition duration-200 text-white font-medium rounded-md inline-block"
            onClick={() => refetchOrder()}
          >
            {isRefetching ? <>Refreshing ...</> : <>Refresh</>}
          </button>
        </div>
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
              orderId={orderId}
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
              paymentFor: "ORDER",
            })
          )}
        >
          <p className="mb-1">
            No payment has yet been made for this order. Please choose a payment
            method.
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
          <div className="flex justify-end gap-3 font-medium">
            <CancelPaymentButton orderId={orderId} />
            <button
              type="submit"
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-400 transition duration-200"
            >
              Proceed
            </button>
          </div>
        </form>
      )}
    </section>
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

function ReceivedOrderSection({
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
  const { mutate: receivedOrder, isLoading } =
    api.onlineOrder.received.useMutation({
      onSuccess: () => refetch(),
    })

  if (onlineOrder.deliveryStatus !== "OutForDelivery") return <></>

  return (
    <section className="text-right max-w-4xl mx-auto pt-3">
      <p className="mb-1">
        <button
          type="button"
          className="bg-red-600 hover:bg-red-500 disabled:bg-red-300 transition duration-200 text-white px-4 py-2 rounded-lg font-semibold text-lg"
          disabled={isLoading}
          onClick={() =>
            receivedOrder({
              id: onlineOrder.id,
            })
          }
        >
          Order Received
        </button>
      </p>
    </section>
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

  if (isLoading) return <LoadingSpinner />
  if (isError) return <div>An error occured</div>
  if (!data) return <div>No order found.</div>

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/account/orders" className="text-emerald-500">
          <CircledArrowLeft />
        </Link>
        <h2 className="font-semibold text-2xl flex items-end">Order Status</h2>
      </div>
      <div className="flex justify-between px-12">
        <p>Order ID: {query.id}</p>
        <div>
          <Link
            href={`/order/${query.id}/receipt`}
            className="text-emerald-500 font-medium"
          >
            View Receipt
          </Link>
        </div>
      </div>
      {data.order.paymentStatus === "Cancelled" ? (
        <p className="text-center pt-6 pb-8">This order has been cancelled.</p>
      ) : (
        <>
          {data.order.paymentStatus === "Pending" && (
            <PaymentStatusSection id={data.paymentIntentId} orderId={data.id} />
          )}
          {data.order.paymentStatus === "Fulfilled" && (
            <OrderStatusSection onlineOrder={data} />
          )}
        </>
      )}
      <OrderItemsSection onlineOrder={data} />
      {data.order.paymentStatus === "Fulfilled" && (
        <>
          <CancelOrderSection onlineOrder={data} />
          <ReceivedOrderSection onlineOrder={data} />
        </>
      )}
    </div>
  )
}

export default function ViewOrderPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {({ user }) => <AuthenticatedPage user={user} />}
      </ProtectedPage>
    </main>
  )
}

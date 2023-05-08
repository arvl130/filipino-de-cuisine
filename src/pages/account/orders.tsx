import { AccountPageSwitcher } from "@/components/account/AccountPageSwitcher"
import { ProtectedPage } from "@/components/account/ProtectedPage"
import { LoadingSpinner } from "@/components/loading"
import { api } from "@/utils/api"
import { DeliveryStatus, OnlineOrder, Order, OrderItem } from "@prisma/client"
import { User } from "firebase/auth"
import Link from "next/link"
import { useState } from "react"

function OrdersListSection({
  onlineOrders,
}: {
  onlineOrders: (OnlineOrder & {
    order: Order & {
      orderItems: OrderItem[]
    }
  })[]
}) {
  const [currentTab, setCurrentTab] = useState<"" | DeliveryStatus>("")
  function formattedDate(givenDate: Date) {
    const year = givenDate.getFullYear()
    const month = givenDate.getMonth() + 1
    const date = givenDate.getDate()

    const monthStr = month < 10 ? `0${month}` : `${month}`
    const dateStr = date < 10 ? `0${date}` : `${date}`

    return `${year}-${monthStr}-${dateStr}`
  }

  const filteredOnlineOrders = onlineOrders.filter((onlineOrder) => {
    if (currentTab === "") return true
    if (currentTab === onlineOrder.deliveryStatus) return true

    return false
  })

  if (onlineOrders.length === 0)
    return (
      <section className="text-center">
        <p className="mb-3">You have not yet made any orders.</p>
        <Link
          href="/menu"
          className="px-6 bg-emerald-500 hover:bg-emerald-400 transition duration-200 text-white text-lg rounded-md pb-2 pt-3 font-semibold inline-block"
        >
          Order Now
        </Link>
      </section>
    )

  return (
    <>
      <section className="border-b border-stone-400 grid grid-cols-6 font-medium mb-3">
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === ""
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : ""
            }`}
            onClick={() => setCurrentTab("")}
          >
            All
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === "Pending"
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : ""
            }`}
            onClick={() => setCurrentTab("Pending")}
          >
            Pending
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === "Preparing"
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : ""
            }`}
            onClick={() => setCurrentTab("Preparing")}
          >
            Preparing
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === "OutForDelivery"
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : ""
            }`}
            onClick={() => setCurrentTab("OutForDelivery")}
          >
            Off to Delivery
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === "Received"
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : ""
            }`}
            onClick={() => setCurrentTab("Received")}
          >
            Delivered
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            className={`pb-2 px-3 ${
              currentTab === "Cancelled"
                ? "text-emerald-500 border-b-4 border-emerald-400"
                : ""
            }`}
            onClick={() => setCurrentTab("Cancelled")}
          >
            Cancelled
          </button>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-6">
        <div>
          <div className="grid grid-cols-[6rem_10rem_10rem_10rem_1fr] gap-3 text-stone-500 font-semibold py-3">
            <div>Order ID</div>
            <div>Date</div>
            <div>Cost</div>
            <div>Status</div>
            <div></div>
          </div>
          {filteredOnlineOrders.length === 0 ? (
            <div className="text-center mt-3">No orders found.</div>
          ) : (
            <>
              {filteredOnlineOrders.map((onlineOrder) => {
                const cost =
                  onlineOrder.order.orderItems.reduce((prev, orderItem) => {
                    return prev + orderItem.price.toNumber()
                  }, 0) + onlineOrder.deliveryFee.toNumber()

                return (
                  <article
                    key={onlineOrder.id}
                    className="grid grid-cols-[6rem_10rem_10rem_10rem_1fr] gap-3 py-3"
                  >
                    <div>{onlineOrder.id}</div>
                    <div>{formattedDate(onlineOrder.order.createdAt)}</div>
                    <div>₱ {cost.toFixed(2)}</div>
                    <div>{onlineOrder.deliveryStatus}</div>
                    <div>
                      <Link
                        href={`/order/${onlineOrder.id}`}
                        className="text-emerald-500 font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </article>
                )
              })}
            </>
          )}
        </div>
      </section>
    </>
  )
}

function AuthenticatedPage({ user }: { user: User }) {
  const { data, isLoading, isError } = api.onlineOrder.getAll.useQuery()

  return (
    <div className="grid grid-cols-[16rem_1fr] gap-3">
      <AccountPageSwitcher user={user} />
      <section>
        <h2 className="px-6 text-2xl font-semibold pb-3">Order Transactions</h2>
        <>
          {isLoading ? (
            <div className="pt-3">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {isError ? (
                <div className="text-center pt-3">An error occured.</div>
              ) : (
                <OrdersListSection onlineOrders={data} />
              )}
            </>
          )}
        </>
      </section>
    </div>
  )
}

export default function OrdersPage() {
  return (
    <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      <ProtectedPage>
        {({ user }) => <AuthenticatedPage user={user} />}
      </ProtectedPage>
    </main>
  )
}

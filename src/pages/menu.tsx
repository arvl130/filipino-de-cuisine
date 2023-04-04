import { MenuItem as MenuPageSectionItem } from "@/components/menu/MenuItem"
import { api } from "@/utils/api"
import { MenuItem } from "@prisma/client"
import Link from "next/link"
import { useState } from "react"

function MenuPageSections({ menuItems }: { menuItems: MenuItem[] }) {
  const [selectedTab, setSelectedTab] = useState<
    "APPETIZER" | "MAIN DISH" | "DESSERT" | "DRINKS"
  >("APPETIZER")

  return (
    <>
      <div className="grid sm:grid-cols-[4rem_1fr_4rem] mb-12">
        {/* Basket */}
        <div className="flex justify-end sm:jusify-start mb-3 sm:mb-0">
          <Link href="/basket">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 [color:_#10B981]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </Link>
        </div>
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-y-3 gap-x-3 lg:gap-x-16 font-bold">
          <button
            type="button"
            onClick={() => setSelectedTab("APPETIZER")}
            className={`px-6 py-2 rounded-full ${
              selectedTab === "APPETIZER"
                ? "bg-red-600 text-white"
                : "bg-neutral-100"
            }`}
          >
            Appetizer
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab("MAIN DISH")}
            className={`px-6 py-2 rounded-full ${
              selectedTab === "MAIN DISH"
                ? "bg-red-600 text-white"
                : "bg-neutral-100"
            }`}
          >
            Main Dish
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("DESSERT")}
            className={`px-6 py-2 rounded-full ${
              selectedTab === "DESSERT"
                ? "bg-red-600 text-white"
                : "bg-neutral-100"
            }`}
          >
            Dessert
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("DRINKS")}
            className={`px-6 py-2 rounded-full ${
              selectedTab === "DRINKS"
                ? "bg-red-600 text-white"
                : "bg-neutral-100"
            }`}
          >
            Drinks
          </button>
        </div>
        {/* placeholder */}
        <div></div>
      </div>
      <section className="flex flex-wrap justify-center gap-x-16 ">
        {menuItems
          .filter((menuItem) => menuItem.category.toUpperCase() === selectedTab)
          .map((menuItem) => {
            return <MenuPageSectionItem key={menuItem.id} menuItem={menuItem} />
          })}
      </section>
    </>
  )
}

export default function MenuPage() {
  const { data, isError, isLoading } = api.menuItem.getAll.useQuery()

  return (
    <main className="max-w-6xl mx-auto w-full px-6 py-12">
      {isLoading ? (
        <>Loading ...</>
      ) : (
        <>
          {isError ? (
            <>An error occured.</>
          ) : (
            <>
              {data === undefined ? (
                <>No data received.</>
              ) : (
                <MenuPageSections menuItems={data} />
              )}
            </>
          )}
        </>
      )}
    </main>
  )
}

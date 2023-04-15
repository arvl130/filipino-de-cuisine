import { Basket } from "@/components/HeroIcons"
import { LoadingSpinner } from "@/components/loading"
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
          <Link href="/menu/basket" className="text-emerald-500">
            <Basket />
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
    <main className="max-w-6xl mx-auto w-full px-6 py-12 h-[calc(100svh_-_4rem)]">
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
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

import { MenuItem } from "@/components/menu/MenuItem"
import { useState } from "react"

const menuItems = [
  {
    id: 1,
    name: "Chicken Adobo",
    category: "Lunch",
    description:
      "Chicken adobo is a popular Filipino dish made with chicken thighs or drumsticks, simmered in a mixture of vinegar, soy sauce, garlic, and bay leaves. The dish has a tangy, savory flavor with a hint of sweetness.",
    price: 120.0,
    imageUrl: "/assets/home/adobo.png",
  },
  {
    id: 2,
    name: "Cocoa Champorado",
    category: "Breakfast",
    description:
      "Cocoa champorado is a sweet Filipino breakfast dish made with glutinous rice, cocoa powder, and milk. ",
    price: 80.0,
    imageUrl: "/assets/home/champorado.png",
  },
  {
    id: 3,
    name: "Cocoa Champorado",
    category: "Breakfast",
    description:
      "Cocoa champorado is a sweet Filipino breakfast dish made with glutinous rice, cocoa powder, and milk. ",
    price: 80.0,
    imageUrl: "/assets/home/champorado.png",
  },
  {
    id: 4,
    name: "Cocoa Champorado",
    category: "Breakfast",
    description:
      "Cocoa champorado is a sweet Filipino breakfast dish made with glutinous rice, cocoa powder, and milk. ",
    price: 80.0,
    imageUrl: "/assets/home/champorado.png",
  },
  {
    id: 5,
    name: "Palabok",
    category: "Dinner",
    description:
      "Palabok is a popular Filipino noodle dish made with rice noodles, a savory shrimp sauce, and an array of toppings such as shrimp, hard-boiled eggs, crushed pork rinds, and green onions.",
    price: 99.0,
    imageUrl: "/assets/home/palabok.png",
  },
  {
    id: 6,
    name: "Palabok",
    category: "Dinner",
    description:
      "Palabok is a popular Filipino noodle dish made with rice noodles, a savory shrimp sauce, and an array of toppings such as shrimp, hard-boiled eggs, crushed pork rinds, and green onions.",
    price: 99.0,
    imageUrl: "/assets/home/palabok.png",
  },
]

export default function MenuPage() {
  const [selectedTab, setSelectedTab] = useState<
    "BREAKFAST" | "LUNCH" | "DINNER"
  >("BREAKFAST")

  return (
    <main className="max-w-6xl mx-auto w-full px-6 py-12">
      <div className="grid grid-cols-[4rem_1fr_4rem] mb-12">
        {/* Basket */}
        <div>
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
        </div>
        {/* Tabs */}
        <div className="flex justify-center gap-16 font-bold">
          <button
            type="button"
            onClick={() => setSelectedTab("BREAKFAST")}
            className={`px-6 py-2 rounded-full ${
              selectedTab === "BREAKFAST"
                ? "bg-red-600 text-white"
                : "bg-neutral-100"
            }`}
          >
            Breakfast
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("LUNCH")}
            className={`px-6 py-2 rounded-full ${
              selectedTab === "LUNCH"
                ? "bg-red-600 text-white"
                : "bg-neutral-100"
            }`}
          >
            Lunch
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("DINNER")}
            className={`px-6 py-2 rounded-full ${
              selectedTab === "DINNER"
                ? "bg-red-600 text-white"
                : "bg-neutral-100"
            }`}
          >
            Dinner
          </button>
        </div>
        {/* placeholder */}
        <div></div>
      </div>
      <section className="flex flex-wrap justify-center gap-x-16 max-w-6xl mx-auto">
        {menuItems
          .filter((menuItem) => menuItem.category.toUpperCase() === selectedTab)
          .map((menuItem) => {
            return <MenuItem key={menuItem.id} menuItem={menuItem} />
          })}
      </section>
    </main>
  )
}

import Link from "next/link"

export default function CheckoutPage() {
  return (
    <main className="max-w-6xl mx-auto w-full px-6 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/menu/basket" className="[color:_#10B981]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Link>
        <h2 className="font-bold text-2xl flex items-end">Checkout</h2>
      </div>
    </main>
  )
}

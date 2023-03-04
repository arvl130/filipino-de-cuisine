import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Inter } from "next/font/google"
import { api } from "../utils/api"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className={`${inter.variable} font-sans text-gray-900`}>
        <div className="min-h-[100svh] grid grid-rows-[5rem_1fr]">
          <nav className="border-b flex items-center">
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Filipino de Cuisine</h1>
              <div className="flex gap-4">
                <span>Menu</span>
                <span>Branches</span>
                <span>Contact Us</span>
                <span>About</span>
              </div>
            </div>
          </nav>
          <Component {...pageProps} />
        </div>
        <footer className="text-center py-3 bg-gray-700 text-white font-medium text-sm">
          &copy; 2023 SBIT-3C
        </footer>
      </div>
    </>
  )
}

export default api.withTRPC(App)

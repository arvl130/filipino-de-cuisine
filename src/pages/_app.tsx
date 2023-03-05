import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Inter, Karla } from "next/font/google"
import Image from "next/image"
import { api } from "../utils/api"

function Navbar() {
  return (
    <nav className="border-b flex items-center px-6 [background-color:_#F1E9E3]">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Image
            src="/assets/logo.png"
            alt="Filipino de Cuisine website logo"
            width={50}
            height={40}
          />
          <h1 className="text-2xl font-medium tracking-wide">
            FILIPINO DE CUISINE
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <span>Home</span>
          <span>Menu</span>
          <span>Reservations</span>
          <span>About Us</span>
          <span>Contact Us</span>
          <span className="[background-color:_#ffffe8] px-6 py-1.5 rounded-full">
            Login
          </span>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer
      className="
      px-6 py-3 
      text-white font-medium font-karla
      [color:_#342006] [background-color:_#DBB688]
    "
    >
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-x-24 gap-y-6 pt-6 pb-5">
        <div className="flex gap-2 items-center">
          <Image
            src="/assets/logo.png"
            alt="Filipino de Cuisine website logo"
            width={50}
            height={40}
          />
          <h1 className="text-2xl font-medium tracking-wide">
            FILIPINO DE CUISINE
          </h1>
        </div>
        <div>
          <p className="font-extrabold">MENU</p>
          <ul>
            <li>Beef Dishes</li>
            <li>Chicken Dishes</li>
            <li>Goat Dishes</li>
            <li>Pork Dishes</li>
            <li>Seafoods Dishes</li>
            <li>Vegetable Dishes</li>
            <li>Filipino Dishes</li>
            <li>Drinks & Beverages</li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold">QUICK LINKS</p>
          <ul>
            <li>Home</li>
            <li>Menu</li>
            <li>Reservations</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div>
          <p className="font-extrabold">STAY CONNECTED</p>
          <p className="flex gap-1">
            <Image
              src="/assets/footer/facebook.png"
              alt="Facebook icon"
              width={50}
              height={50}
              className="w-8 h-8"
            />
            <Image
              src="/assets/footer/instagram.png"
              alt="Instagram icon"
              width={50}
              height={50}
              className="w-8 h-8"
            />
            <Image
              src="/assets/footer/mail.png"
              alt="Mail icon"
              width={50}
              height={50}
              className="w-8 h-8"
            />
            <Image
              src="/assets/footer/viber.png"
              alt="Viber icon"
              width={50}
              height={50}
              className="w-8 h-8"
            />
          </p>
        </div>
      </div>
      <div className="text-center text-sm">
        <hr className="[border-color:_#342006]" />
        <p className="pt-3">
          &copy; 2023.{" "}
          <span className="[color:_#A44D08]">Filipino de Cuisine</span>
        </p>
        <p>All Rights Reserved.</p>
      </div>
    </footer>
  )
}

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const karla = Karla({ subsets: ["latin"], variable: "--font-karla" })

function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${inter.variable} ${karla.variable} font-sans [color:_#342006]`}
    >
      <div className="min-h-[100svh] grid grid-rows-[4rem_1fr]">
        <Navbar />
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  )
}

export default api.withTRPC(App)

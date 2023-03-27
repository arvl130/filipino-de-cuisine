import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Hind, Inika, Karla } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { api } from "../utils/api"
import { AuthProvider } from "@/utils/auth"

function Navbar() {
  return (
    <nav>
      <div className="h-full max-w-7xl mx-auto flex justify-between items-center py-4 px-6 font-semibold text-lg">
        <div className="flex gap-6 items-center">
          <Link href="/" className="[color:_#10B981]">
            Home
          </Link>
          •<Link href="/menu">Menu</Link>•
          <Link href="/reservation">Reservation</Link>
        </div>
        <h1 className="font-inika font-bold text-2xl">
          <span className="uppercase [color:_#DC2626]">Filipino</span>{" "}
          <span className="uppercase [color:_#78716C]">de Cuisine</span>
        </h1>
        <div className="flex gap-6 items-center">
          <Link href="/about">About</Link>•<Link href="/contact">Contact</Link>•
          <Link
            href="/signin"
            className="[background-color:_#10B981] text-white px-4 py-2 rounded-full font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-black text-white px-6">
      <p className="text-center font-inika text-xl font-bold pt-16 pb-5">
        <span className="uppercase [color:_#DC2626]">Filipino</span>{" "}
        <span className="uppercase [color:_#78716C]">de Cuisine</span>
      </p>
      <ul className="flex gap-6 flex-wrap justify-center font-semibold py-3">
        <li>Home</li>•<li>Menu</li>•<li>Reservation</li>•<li>About</li>•
        <li>Contact</li>•<li>Legal Terms</li>
      </ul>
      <div className="flex gap-10 py-3 justify-center items-center">
        <Image
          src="/assets/footer/facebook.png"
          alt="Facebook icon"
          height={36}
          width={36}
        />
        <Image
          src="/assets/footer/instagram.png"
          alt="Instagram icon"
          height={36}
          width={36}
        />
        <Image
          src="/assets/footer/gmail.png"
          alt="Gmail icon"
          height={36}
          width={36}
        />
        <Image
          src="/assets/footer/viber.png"
          alt="Viber icon"
          height={36}
          width={36}
        />
      </div>
      <div className="[color:_#78716C] text-center pt-4 pb-6 font-medium text-sm">
        <p className="font-karla leading-5">
          &copy; 2023. <span className="text-white">Filipino de Cuisine</span>
        </p>
        <p className="leading-5">All Rights Reserved.</p>
      </div>
    </footer>
  )
}

const hind = Hind({
  subsets: ["latin"],
  variable: "--font-hind",
  weight: ["400", "500", "600", "700"],
})

const inika = Inika({
  subsets: ["latin"],
  variable: "--font-inika",
  weight: ["400", "700"],
})

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
})

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div
        className={`${hind.variable} ${inika.variable} ${karla.variable} font-sans`}
      >
        <div className="min-h-[100svh] grid grid-rows-[4rem_1fr]">
          <Navbar />
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default api.withTRPC(App)

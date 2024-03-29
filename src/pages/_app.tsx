import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Hind, Inika, Karla } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { api } from "../utils/api"
import { AuthProvider, useSession } from "@/utils/auth"
import { useRouter } from "next/router"
import { ReactNode, useState } from "react"
import Head from "next/head"

export function ProtectedNavbarLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  const router = useRouter()
  const { isLoading: isLoadingSession, isAuthenticated } = useSession()
  const { isLoading: isLoadingCustomer, isError: isErrorCustomer } =
    api.customerInfo.get.useQuery(undefined, {
      enabled: !isLoadingSession && isAuthenticated,
    })

  if (isLoadingSession)
    return (
      <span className={router.pathname === href ? "text-emerald-500" : ""}>
        {children}
      </span>
    )

  if (!isAuthenticated)
    return (
      <Link
        href="/signin"
        className={router.pathname === href ? "text-emerald-500" : ""}
      >
        {children}
      </Link>
    )

  if (isLoadingCustomer)
    return (
      <span className={router.pathname === href ? "text-emerald-500" : ""}>
        {children}
      </span>
    )

  if (isErrorCustomer)
    return (
      <span className={router.pathname === href ? "text-red-500" : ""}>
        {children}
      </span>
    )

  return (
    <Link
      href={href}
      className={router.pathname === href ? "text-emerald-500" : ""}
    >
      {children}
    </Link>
  )
}

export function ProtectedFooterReservationLink() {
  const { isLoading: isLoadingSession, isAuthenticated } = useSession()
  const { isLoading: isLoadingCustomer, isError: isErrorCustomer } =
    api.customerInfo.get.useQuery(undefined, {
      enabled: !isLoadingSession && isAuthenticated,
    })

  if (isLoadingSession)
    return (
      <span className="px-6 text-emerald-500 transition duration-200 border-emerald-500 border text-lg rounded-md pb-2 pt-3 font-semibold">
        Book a Reservation
      </span>
    )

  if (!isAuthenticated) return <Link href="/signin">Reservation</Link>

  if (isLoadingCustomer)
    return (
      <span className="px-6 text-emerald-500 transition duration-200 border-emerald-500 border text-lg rounded-md pb-2 pt-3 font-semibold">
        Book a Reservation
      </span>
    )

  if (isErrorCustomer)
    return (
      <span className="px-6 text-red-500 transition duration-200 border-red-500 border text-lg rounded-md pb-2 pt-3 font-semibold">
        Book a Reservation
      </span>
    )

  return <Link href="/reservation">Reservation</Link>
}

export function ProtectedNavbarMobileMenuReservationLink({
  onClick,
}: {
  onClick: () => void
}) {
  const router = useRouter()
  const { isLoading: isLoadingSession, isAuthenticated } = useSession()
  const { isLoading: isLoadingCustomer, isError: isErrorCustomer } =
    api.customerInfo.get.useQuery(undefined, {
      enabled: !isLoadingSession && isAuthenticated,
    })

  if (isLoadingSession)
    return (
      <span
        className={`pt-1 ${
          router.pathname === "/reservation" ? "text-emerald-500" : ""
        }`}
      >
        Book a Reservation
      </span>
    )

  if (!isAuthenticated)
    return (
      <Link
        href="/signin"
        onClick={onClick}
        className={`pt-1 ${
          router.pathname === "/reservation" ? "text-emerald-500" : ""
        }`}
      >
        Reservation
      </Link>
    )

  if (isLoadingCustomer)
    return (
      <span
        className={`pt-1 ${
          router.pathname === "/reservation" ? "text-emerald-500" : ""
        }`}
      >
        Book a Reservation
      </span>
    )

  if (isErrorCustomer)
    return (
      <span
        className={`pt-1 ${
          router.pathname === "/reservation" ? "text-red-500" : ""
        }`}
      >
        Book a Reservation
      </span>
    )

  return (
    <Link
      href="/reservation"
      onClick={onClick}
      className={`pt-1 ${
        router.pathname === "/reservation" ? "text-emerald-500" : ""
      }`}
    >
      Reservation
    </Link>
  )
}

function Navbar() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useSession()
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  return (
    <>
      <nav className="border-b fixed top-0 left-0 right-0 bg-white z-10">
        <div className="h-16 max-w-7xl mx-auto flex justify-between items-center py-1 px-3 sm:px-6 font-semibold text-lg">
          <div className="hidden lg:flex gap-6 items-center">
            <Link
              href="/"
              className={router.pathname === "/" ? "text-emerald-500" : ""}
            >
              Home
            </Link>
            •
            <Link
              href="/menu"
              className={router.pathname === "/menu" ? "text-emerald-500" : ""}
            >
              Menu
            </Link>
            •
            <ProtectedNavbarLink href="/reservation">
              Reservation
            </ProtectedNavbarLink>
          </div>
          <h1 className="font-inika font-bold text-2xl">
            <Link href="/">
              <span className="uppercase [color:_#DC2626]">Filipino</span>{" "}
              <span className="uppercase [color:_#78716C]">de Cuisine</span>
            </Link>
          </h1>
          {/* Menu button for mobile */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMenuVisible((currentValue) => !currentValue)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex gap-6 items-center">
            <Link
              href="/about"
              className={router.pathname === "/about" ? "text-emerald-500" : ""}
            >
              About
            </Link>
            •
            <Link
              href="/contact"
              className={
                router.pathname === "/contact" ? "text-emerald-500" : ""
              }
            >
              Contact
            </Link>
            •
            {isLoading ? (
              <span className="w-28 text-center bg-emerald-300 text-white px-4 py-2 rounded-full font-semibold">
                <br />
              </span>
            ) : (
              <>
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    className="w-28 text-center bg-emerald-500 hover:bg-emerald-400 transition duration-200 text-white px-4 py-2 rounded-full font-semibold"
                  >
                    Account
                  </Link>
                ) : (
                  <Link
                    href="/signin"
                    className="w-28 text-center bg-emerald-500 hover:bg-emerald-400 transition duration-200 text-white px-4 py-2 rounded-full font-semibold"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
        {isMenuVisible && (
          <div className="lg:hidden px-3 sm:px-6 pb-3 flex flex-col font-medium">
            <Link
              href="/"
              onClick={() => {
                setIsMenuVisible(false)
              }}
              className={`${router.pathname === "/" ? "text-emerald-500" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/menu"
              onClick={() => setIsMenuVisible(false)}
              className={`pt-1 ${
                router.pathname === "/menu" ? "text-emerald-500" : ""
              }`}
            >
              Menu
            </Link>
            <ProtectedNavbarMobileMenuReservationLink
              onClick={() => setIsMenuVisible(false)}
            />
            <Link
              href="/about"
              onClick={() => setIsMenuVisible(false)}
              className={`pt-1 ${
                router.pathname === "/about" ? "text-emerald-500" : ""
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuVisible(false)}
              className={`pt-1 ${
                router.pathname === "/contact" ? "text-emerald-500" : ""
              }`}
            >
              Contact
            </Link>
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <Link
                    href="/account"
                    onClick={() => setIsMenuVisible(false)}
                    className={`pt-1 ${
                      router.pathname === "/account" ? "text-emerald-500" : ""
                    }`}
                  >
                    Account
                  </Link>
                ) : (
                  <Link
                    href="/signin"
                    onClick={() => setIsMenuVisible(false)}
                    className={`pt-1 ${
                      router.pathname === "/signin" ? "text-emerald-500" : ""
                    }`}
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </nav>
      <div className="h-16"></div>
    </>
  )
}

function Footer() {
  return (
    <footer className="bg-black text-white px-6">
      <div className="pt-16 pb-5 text-center">
        <Image
          src="/assets/website-logo.png"
          alt="Logo of Filipino de Cuisine"
          height={100}
          width={100}
          className="inline-block"
        />
        <p className="text-center font-inika text-xl font-bold">
          <span className="uppercase [color:_#DC2626]">Filipino</span>{" "}
          <span className="uppercase [color:_#78716C]">de Cuisine</span>
        </p>
      </div>
      <ul className="hidden md:flex gap-6 flex-wrap justify-center font-semibold py-3">
        <li>
          <Link href="/">Home</Link>
        </li>
        •
        <li>
          <Link href="/menu">Menu</Link>
        </li>
        •
        <li>
          <ProtectedFooterReservationLink />
        </li>
        •
        <li>
          <Link href="/about">About</Link>
        </li>
        •
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        •
        <li>
          <Link href="/terms-and-conditions">Legal Terms</Link>
        </li>
        •
        <li>
          <Link href="/faq">FAQs</Link>
        </li>
      </ul>
      <ul className="md:hidden text-center font-semibold py-3">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li className="mt-1">
          <Link href="/menu">Menu</Link>
        </li>
        <li className="mt-1">
          <ProtectedFooterReservationLink />
        </li>
        <li className="mt-1">
          <Link href="/about">About</Link>
        </li>
        <li className="mt-1">
          <Link href="/contact">Contact</Link>
        </li>
        <li className="mt-1">
          <Link href="/faq">FAQs</Link>
        </li>
        <li className="mt-1">
          <Link href="/terms-and-conditions">Legal Terms</Link>
        </li>
      </ul>
      <div className="flex flex-wrap gap-y-3 gap-x-10 py-3 justify-center items-center">
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
  weight: ["700"],
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
        <Head>
          <title>Filipino de Cuisine</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="A taste of tradition in every bite"
          />
        </Head>
        <div className="min-h-[100svh]">
          <Navbar />
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default api.withTRPC(App)

import { api } from "@/utils/api"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

function HeroSection() {
  return (
    <div className="text-center [color:_#F5EEE9] font-bold mt-36 mb-24">
      <p className="text-7xl md:text-9xl mb-2">WELCOME</p>
      <p className="mb-6">
        When it comes to Filipino food, nothing beats Filipino De Cuisine.
      </p>
      <div className="text-center">
        <Link
          href={"/"}
          className="inline-block px-4 py-1.5 text-white text-lg transition duration-200 hover:bg-yellow-500 [background-color:_#DEA02C] rounded-lg font-bold"
        >
          ORDER NOW
        </Link>
      </div>
    </div>
  )
}

function DishesSection() {
  return (
    <div
      className="grid grid-cols-4 items-center overflow-x-clip pb-5"
      style={{
        background: "linear-gradient(180deg, transparent 50%, #DBB688 50%)",
      }}
    >
      <Image
        src="/assets/homepage-dish1.png"
        alt="dish 1"
        width={300}
        height={300}
        className="z-[4] w-full aspect-square scale-110"
      />
      <Image
        src="/assets/homepage-dish2.png"
        alt="dish 2"
        width={300}
        height={300}
        className="z-[3] w-full aspect-square scale-110"
      />
      <Image
        src="/assets/homepage-dish3.png"
        alt="dish 3"
        width={300}
        height={300}
        className="z-[2] w-full aspect-square scale-110"
      />
      <Image
        src="/assets/homepage-dish4.png"
        alt="dish 4"
        width={300}
        height={300}
        className="z-[1] w-full aspect-square scale-110"
      />
    </div>
  )
}

export default function Home() {
  const { data } = api.hello.useQuery({
    text: "world!",
  })

  return (
    <>
      <Head>
        <title>Filipino de Cuisine</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="w-full"
        style={{
          backgroundImage: "url('/assets/homepage-wallpaper.jpeg')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <main className="pt-4 items-center w-full grid grid-rows-[1fr_auto] h-full">
          <HeroSection />
          <DishesSection />
        </main>
      </div>
    </>
  )
}

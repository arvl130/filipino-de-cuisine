import { Basket } from "@/components/HeroIcons"
import { MenuItem as FeaturedDishesSectionItem } from "@/components/menu/MenuItem"
import { Prisma } from "@prisma/client"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 grid grid-cols-[1fr_32rem] h-[calc(100svh_-_4rem)]">
      <div className="flex flex-col justify-center">
        <p className="text-3xl font-bold">Welcome to Filipino de Cuisine!</p>
        <p className="[color:_#78716C]">
          Your destination for authentic and delicious Filipino food. Our
          passion is to bring the flavors of the Philippines to your table, with
          dishes that are rich in tradition and culture.
        </p>
        <div className="inline-flex gap-3 mt-3">
          <Link
            href="/menu"
            className="px-6 [background-color:_#10B981] text-white text-lg rounded-md pb-2 pt-3 font-semibold"
          >
            Order Now
          </Link>
          <Link
            href="/reservation"
            className="px-6 [color:_#10B981] [border-color:_#10B981] border text-white text-lg rounded-md pb-2 pt-3 font-semibold"
          >
            Book a Reservation
          </Link>
        </div>
      </div>
      <div className="flex items-center">
        <Image
          src="/assets/home/adobo.png"
          width={1000}
          height={1000}
          alt="Adobo with rice on a plate"
        />
      </div>
    </section>
  )
}

function QuoteSection() {
  return (
    <section className="bg-black text-white px-6 py-12 text-center font-inika text-3xl">
      &ldquo; The taste of tradition in every bite. &rdquo;
    </section>
  )
}

function TestimonialsSectionItem() {
  return (
    <article className="bg-white rounded-md px-6 pt-4">
      <div className="flex items-center gap-6 mb-3">
        <div className="[box-shadow:_0px_4px_4px_rgba(0,_0,_0,_0.25)] [background-color:_#F5F5F5] h-24 aspect-square rounded-full">
          <Image
            src="/assets/home/user-icon.png"
            alt="Customer profile picture"
            width={96}
            height={96}
          />
        </div>
        <p className="font-bold text-xl">John Doe</p>
      </div>
      <p className="text-center [color:_#78716C]">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non
        quis exercitationem culpa nesciunt nihil aut nostrum explicabo
      </p>
      <div className="text-center translate-y-4">
        <div className="inline-block bg-black text-white px-6 pt-2 pb-1 text-2xl rounded-lg">
          ★★★★<span className="[color:_#78716C]">★</span>
        </div>
      </div>
    </article>
  )
}

function TestimonialsSection() {
  return (
    <section className="[background-color:_#F5F5F5] px-6 pt-8 pb-20">
      <div>
        <h2 className="[color:_#78716C] text-center mb-3">Client Feedback</h2>
        <p className="text-black font-bold text-3xl text-center mb-10">
          See what our clients say about our services
        </p>
      </div>
      <div className="grid grid-cols-3 gap-10 max-w-6xl mx-auto">
        <TestimonialsSectionItem />
        <TestimonialsSectionItem />
        <TestimonialsSectionItem />
      </div>
    </section>
  )
}

const menuItems = [
  {
    id: 1,
    name: "Chicken Adobo",
    category: "Lunch / Dinner",
    description:
      "Chicken adobo is a popular Filipino dish made with chicken thighs or drumsticks, simmered in a mixture of vinegar, soy sauce, garlic, and bay leaves. The dish has a tangy, savory flavor with a hint of sweetness.",
    price: new Prisma.Decimal(120.0),
    imgUrl: "/assets/home/adobo.png",
    isActive: true,
  },
  {
    id: 2,
    name: "Cocoa Champorado",
    category: "Breakfast",
    description:
      "Cocoa champorado is a sweet Filipino breakfast dish made with glutinous rice, cocoa powder, and milk. ",
    price: new Prisma.Decimal(80.0),
    imgUrl: "/assets/home/champorado.png",
    isActive: true,
  },
  {
    id: 3,
    name: "Palabok",
    category: "Breakfast",
    description:
      "Palabok is a popular Filipino noodle dish made with rice noodles, a savory shrimp sauce, and an array of toppings such as shrimp, hard-boiled eggs, crushed pork rinds, and green onions.",
    price: new Prisma.Decimal(99.0),
    imgUrl: "/assets/home/palabok.png",
    isActive: true,
  },
]

function FeaturedDishesSection() {
  return (
    <section className="[border-color:_#F5F5F5] border-2 pt-8 pb-12 px-6">
      <div className="grid grid-cols-[4rem_1fr_4rem]">
        <div className="flex justify-end">
          <Link href="/menu/basket" className="text-emerald-500">
            <Basket />
          </Link>
        </div>
        <div className="text-center">
          <h2 className="[color:_#78716C] mb-3">Customers Pick</h2>
          <p className="font-bold text-3xl mb-12">Featured Dishes</p>
        </div>
        <div></div>
      </div>
      <div className="flex justify-center gap-28 max-w-6xl mx-auto">
        {menuItems.map((menuItem) => {
          return (
            <FeaturedDishesSectionItem key={menuItem.id} menuItem={menuItem} />
          )
        })}
      </div>
    </section>
  )
}

function StepsSection() {
  return (
    <section className="px-6 max-w-5xl mx-auto grid gap-12 grid-cols-[1fr_auto_1fr_auto_1fr] py-24">
      <article>
        <p className="[color:_#E0E0E0] text-5xl font-bold">01</p>
        <h3 className="font-semibold">Online Reservation</h3>
        <p className="[color:_#78716C] text-justify">
          To make a reservation, simply fill out the form with your desired date
          and time, as well as the number of guests.{" "}
        </p>
      </article>
      <div className="flex items-center">
        <div className="[background-color:_#E0E0E0] w-[2px] h-16"></div>
      </div>
      <article>
        <p className="[color:_#E0E0E0] text-5xl font-bold">02</p>
        <h3 className="font-semibold">Online Order Simply</h3>
        <p className="[color:_#78716C] text-justify">
          Browse our menu and select your desired dishes, then add them to your
          cart. Proceed to checkout and enter your contact and payment
          information.
        </p>
      </article>
      <div className="flex items-center">
        <div className="[background-color:_#E0E0E0] w-[2px] h-16"></div>
      </div>
      <article>
        <p className="[color:_#E0E0E0] text-5xl font-bold">03</p>
        <h3 className="font-semibold">Fast Delivery</h3>
        <p className="[color:_#78716C] text-justify">
          Our fast delivery service ensures that you can enjoy your favorite
          Filipino dishes without the hassle of cooking or leaving your home.
        </p>
      </article>
    </section>
  )
}

function CallToActionSection() {
  return (
    <section className="px-6 pb-20 pt-6 max-w-5xl mx-auto grid grid-cols-2 gap-12">
      <div className="flex justify-end">
        <Image
          src="/assets/home/call-to-action.png"
          width={400}
          height={400}
          alt="Kare-Kare"
          className="w-full aspect-square rounded-2xl object-cover"
        />
      </div>
      <div className="flex flex-col gap-8 justify-center">
        <p className="font-inika text-2xl">
          Don&apos;t miss out on the mouth-watering flavors of Filipino de
          Cuisine!
        </p>
        <div className="inline-flex gap-3">
          <Link
            href="/menu"
            className="px-6 [background-color:_#10B981] text-lg text-white rounded-md pb-2 pt-3 font-semibold"
          >
            Order Now
          </Link>
          <Link
            href="/reservation"
            className="px-6 [color:_#10B981] [border-color:_#10B981] border text-lg text-white rounded-md pb-2 pt-3 font-semibold"
          >
            Book a Reservation
          </Link>
        </div>
        <Link
          href="/menu"
          className=" [color:_#10B981] text-white rounded-md font-semibold text-lg"
        >
          Explore our menu »
        </Link>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Filipino de Cuisine</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <main className="items-center ">
          <HeroSection />
          <QuoteSection />
          <TestimonialsSection />
          <FeaturedDishesSection />
          <StepsSection />
          <CallToActionSection />
        </main>
      </div>
    </>
  )
}

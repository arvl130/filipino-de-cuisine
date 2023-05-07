import Link from "next/link"
import { useState } from "react"
import { Inter } from "next/font/google"

type TabCategory =
  | "PAYMENT"
  | "DELIVERY"
  | "ORDERS"
  | "RESERVATION"
  | "REFUNDS"
  | "ACCOUNT"

const questionsAndAnswers: {
  question: string
  answer: string
  category: TabCategory
}[] = [
  {
    question: "What payment methods do you accept?",
    answer:
      "Filipino de Cuisine website accepts various payment methods, including GCash and Maya.",
    category: "PAYMENT",
  },
  {
    question: "Is it safe to make payments online?",
    answer:
      "Yes, it is safe to make payments online on the Filipino de Cuisine restaurant website as long as customers take the necessary security measures. The website is secure and uses encryption to protect customer information.",
    category: "PAYMENT",
  },
  {
    question:
      "What should I do if I encounter payment problems on the Filipino de Cuisine restaurant website?",
    answer:
      "Customers should contact the Filipino de Cuisine restaurant customer support team immediately if they encounter payment problems. The team can assist in resolving any issues.",
    category: "PAYMENT",
  },
  {
    question: "Can I pay for my order using cash on delivery?",
    answer:
      "No, Filipino de Cuisine website does not offer cash on delivery as a payment option. However, we do accept GCash and Maya.",
    category: "PAYMENT",
  },
  {
    question:
      "Can I change my payment method after I have placed an order on Filipino de Cuisine website?",
    answer:
      "No, you cannot change your payment method after you have placed an order on Filipino de Cuisine website.",
    category: "PAYMENT",
  },
  {
    question:
      "Are there any additional fees for using a certain payment method?",
    answer:
      "No, Filipino de Cuisine website does not charge any additional fees for using a certain payment method. However, GCash and Maya may charge fees for certain transactions.",
    category: "PAYMENT",
  },
  {
    question: "How long does it take for my order to be delivered?",
    answer:
      "The delivery time on Filipino de Cuisine website may vary depending on your orders, location, and the delivery option you choose.",
    category: "DELIVERY",
  },
  {
    question: "How much does delivery cost on Filipino de Cuisine website?",
    answer:
      "Yes, it is safe to make payments online on the Filipino de Cuisine restaurant website as long as customers take the necessary security measures. The website is secure and uses encryption to protect customer information.",
    category: "DELIVERY",
  },
  {
    question: "Can I track my order on Filipino de Cuisine website?",
    answer:
      "Yes, you can track your order on Filipino de Cuisine website once it has been placed.",
    category: "DELIVERY",
  },
  {
    question: "What areas do Filipino de Cuisine deliver to?",
    answer:
      "Filipino de Cuisine delivers to selected areas within the Philippines. You can check if your location is covered by entering your address during the checkout process.",
    category: "DELIVERY",
  },
  {
    question: "Can I choose a specific delivery date for my order?",
    answer:
      "Unfortunately, Filipino de Cuisine does not currently offer the option to choose a specific delivery date. Your order will be delivered the same day you placed it.",
    category: "DELIVERY",
  },
  {
    question:
      "Can I request for my delivery to be left at a specific location?",
    answer:
      "Yes, you can request for your delivery to be left at a specific location, such as with a neighbor or in a safe place. You can provide these instructions during the checkout process.",
    category: "DELIVERY",
  },
  {
    question: "How do I place an order?",
    answer:
      "To place an order on our website, simply select the items you would like to order and add them to your basket. Once you have finished selecting your items, proceed to checkout, enter your delivery or pickup information, and complete your payment.",
    category: "ORDERS",
  },
  {
    question:
      "How do I check the status of my order on Filipino de Cuisine's website?",
    answer:
      "The order status will show up right after you place an order. You may also view on Order History on the Account page.",
    category: "ORDERS",
  },
  {
    question: "Can I make changes to my order after it has been placed?",
    answer:
      "No, you cannot make changes to your order after it has been placed. However, you may be able to cancel your order if the status is still “Order Confirmed” and place a new one with the correct items.",
    category: "ORDERS",
  },
  {
    question: "Why can't I cancel my order?",
    answer:
      'Order cancellation is only possible while the status is still "Order Confirmed"; otherwise, it cannot be done.',
    category: "ORDERS",
  },
  {
    question: "How do I know if my order has been successfully placed?",
    answer:
      "After you have completed your order on Filipino de Cuisine website, you will be able to view your order history and track your order status.",
    category: "ORDERS",
  },
  {
    question: "What should I do if I receive an incorrect order?",
    answer:
      "If you receive an incorrect order, you should contact the customer support team on Filipino de Cuisine website as soon as possible. They will provide you with a solution, such as a replacement or refund.",
    category: "ORDERS",
  },
  {
    question: "How do I make a reservation on Filipino de Cuisine's website?",
    answer:
      'To make a reservation on our website, simply select the "Reservation" tab and fill out the required information, including the date and time of your desired reservation, the number of guests, and any special requests.',
    category: "RESERVATION",
  },
  {
    question: "Can I modify my reservation on Filipino de Cuisine's website?",
    answer: "Once a reservation has been confirmed, it cannot be changed.",
    category: "RESERVATION",
  },
  {
    question: "Can I cancel my reservation on Filipino de Cuisine's website?",
    answer:
      "Yes, you can cancel your reservation. However, reservation fee for canceled reservations are not refundable. ",
    category: "RESERVATION",
  },
  {
    question: "Is there a minimum number of guests required for a reservation?",
    answer:
      "No, there is no minimum required guest in making a reservation at Filipino de Cuisine. Our table can fit 2 to 3 persons comfortably, you may select multiple tables if you intend to reserve for a large group.",
    category: "RESERVATION",
  },
  {
    question: "Can I make a reservation for a date that is currently closed?",
    answer:
      "No, you cannot make a reservation for a date that is marked closed. The reservation system on Filipino de Cuisine will only allow you to reserve on available dates and times.",
    category: "RESERVATION",
  },
  {
    question: "Is there a fee for making a reservation?",
    answer:
      "To reserve your spot, kindly note that a 500 pesos fee is required. Canceled reservations are not refundable.",
    category: "RESERVATION",
  },
  {
    question: "Can I get a refund if I am not satisfied with my order?",
    answer:
      "We strive to provide our customers with high-quality food and service, but if you are not satisfied with your order, please contact our customer support team to discuss your concerns.",
    category: "REFUNDS",
  },
  {
    question: "Can I get a refund if I need to cancel my reservation?",
    answer:
      "No, cancelled reservations are not refundable in our website. However, you may contact our restaurant staff and they will be happy to assist customer concerns and requests.",
    category: "REFUNDS",
  },
  {
    question: "How do I update my account information? ",
    answer:
      'To update your account information, simply log in to your account and navigate to the "Account Settings". From there, you can update your email, address, and contact number, and password.',
    category: "ACCOUNT",
  },
  {
    question:
      "Do I need to create an account to place an order on Filipino de Cuisine website?",
    answer:
      "Yes, you need an account to place an order on Filipino de Cuisine. ",
    category: "ACCOUNT",
  },
  {
    question: "What should I do if I forgot my password?",
    answer:
      'If you forget your password, simply click on the "Forgot Password" link on the login page',
    category: "ACCOUNT",
  },
  {
    question: "Is there a fee to create an account on Filipino de Cuisine?",
    answer: "No, there is no fee to create an account on Filipino de Cuisine.",
    category: "ACCOUNT",
  },
  {
    question:
      "Do I need to create an account to make a reservation on Filipino de Cuisine website?",
    answer:
      "Yes, you need an account to make a reservation on Filipino de Cuisine. ",
    category: "ACCOUNT",
  },
]

function SectionItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  return (
    <article className="border-2 border-stone-200 rounded-md px-8 py-6">
      <h3 className="font-semibold">{question}</h3>
      <p>{answer}</p>
    </article>
  )
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function FrequentlyAskedQuestionsPage() {
  const [currentTab, setCurrentTab] = useState<TabCategory>("PAYMENT")
  return (
    <main className={`${inter.variable} max-w-6xl mx-auto w-full px-6 py-12`}>
      <header className="grid grid-cols-2 items-end mb-10">
        <div>
          <p>FAQs</p>
          <h2 className="font-bold text-2xl text-emerald-500 font-inter">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>
        <p>
          Got a question? We&apos;re here to answer! If you don&apos;t see your
          question here, drop us a line on our Contact Page.
        </p>
      </header>
      <section>
        <header className="border-b border-stone-400 flex justify-around font-medium mb-10">
          <button
            type="button"
            className={`${
              currentTab === "PAYMENT"
                ? "pb-2 text-red-600 border-b-4 border-red-600"
                : "pb-3"
            }`}
            onClick={() => setCurrentTab("PAYMENT")}
          >
            Payment
          </button>
          <button
            type="button"
            className={`${
              currentTab === "DELIVERY"
                ? "pb-2 text-red-600 border-b-4 border-red-600"
                : "pb-3 "
            }`}
            onClick={() => setCurrentTab("DELIVERY")}
          >
            Delivery
          </button>
          <button
            type="button"
            className={`${
              currentTab === "ORDERS"
                ? "pb-2 text-red-600 border-b-4 border-red-600"
                : "pb-3 "
            }`}
            onClick={() => setCurrentTab("ORDERS")}
          >
            Orders
          </button>
          <button
            type="button"
            className={`${
              currentTab === "RESERVATION"
                ? "pb-2 text-red-600 border-b-4 border-red-600"
                : "pb-3 "
            }`}
            onClick={() => setCurrentTab("RESERVATION")}
          >
            Reservation
          </button>
          <button
            type="button"
            className={`${
              currentTab === "REFUNDS"
                ? "pb-2 text-red-600 border-b-4 border-red-600"
                : "pb-3 "
            }`}
            onClick={() => setCurrentTab("REFUNDS")}
          >
            Refunds
          </button>
          <button
            type="button"
            className={`${
              currentTab === "ACCOUNT"
                ? "pb-2 text-red-600 border-b-4 border-red-600"
                : "pb-3 "
            }`}
            onClick={() => setCurrentTab("ACCOUNT")}
          >
            Account
          </button>
        </header>
        <section className="grid grid-cols-3 gap-3 mb-6">
          {questionsAndAnswers
            .filter(({ category }) => category === currentTab)
            .map(({ question, answer }, index) => (
              <SectionItem question={question} answer={answer} key={index} />
            ))}
        </section>
        <section className="flex justify-between bg-stone-100 px-12 py-8 rounded-md items-center">
          <div>
            <p className="font-semibold text-red-500">Still have questions?</p>
            <p>
              Can&apos;t find the answer you&apos;re looking for? Our team would
              love to talk with you.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 bg-emerald-500 hover:bg-emerald-400 transition duration-200 text-white text-lg rounded-md pb-1 pt-2 font-semibold"
          >
            Get in Touch
          </Link>
        </section>
      </section>
    </main>
  )
}

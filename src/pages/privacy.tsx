import Image from "next/image"
import Link from "next/link"

export default function HeaderSection() {
  return (
    <section className="privacy">
      <div className="privacy">
        <div className=" bg-emerald-500 h-72 flex items-center">
          <div className="max-w-5xl mx-auto grid grid-cols-[4rem_1fr] items-center w-full px-6">
            <div className="image">
              <Link href={"/terms-and-conditions"}>
                <Image
                  src="/assets/privacy/symbol2.png"
                  alt="next"
                  width={40}
                  height={40}
                />
              </Link>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xl mb-2">
                Legal Terms
              </h4>
              <h1 className="text-white font-bold text-3xl mb-2">
                Filipino de Cuisine Privacy Policy
              </h1>
              <p className="text-xl text-white font-medium">
                Last updated: March 25, 2023
              </p>
            </div>
          </div>
        </div>

        <div className="description max-w-4xl mx-auto text-justify px-6 my-20">
          <h6>
            Welcome to Filipino de Cuisine restaurant&apos;s website. By
            accessing or using our website, you agree to be bound by the
            following terms and conditions:
          </h6>

          <ol className="list-decimal list-outside pl-6 my-6">
            <li className="mb-6">
              <span className="font-medium">Use of Website Content</span>: We
              may use images gathered from Google for visual representation and
              illustrative purposes on our website. We respect the rights of
              copyright holders and strive to use images that are properly
              licensed or in the public domain.
            </li>
            <li className="mb-6">
              <span className="font-medium">User Conduct</span>: You agree to
              use our website only for lawful purposes and in a manner that does
              not infringe upon the rights of others or interfere with the
              operation of our website. You may not upload, post, transmit,
              distribute, or otherwise publish any content that is unlawful,
              harmful, threatening, abusive, harassing, defamatory, vulgar,
              obscene, invasive of another&apos;s privacy, or otherwise
              objectionable.
            </li>
            <li className="mb-6">
              <span className="font-medium">Reservation</span>: You may make a
              reservation for a table at our restaurant through our website. All
              reservations are subject to availability and confirmation by
              Filipino de Cuisine restaurant.
            </li>
            <li className="mb-6">
              <span className="font-medium">Payment</span>: When you make an
              online payment using GCash and/or Maya, customer will enter
              his/her GCash or Maya Account name, phone number, and pin or
              password.
            </li>
            <li className="mb-6">
              <span className="font-medium">Links to Third-Party Websites</span>
              : Our website may contain links to third-party websites that are
              not owned or controlled by Filipino de Cuisine restaurant. We are
              not responsible for the content or privacy practices of these
              websites and do not endorse or make any representations about
              them.
            </li>
            <li className="mb-6">
              <span className="font-medium">Disclaimer of Warranties</span>: We
              make no representations or warranties of any kind, express or
              implied, regarding the operation of our website or the
              information, content, materials, or products included on our
              website. You use our website at your own risk.
            </li>
            <li className="mb-6">
              <span className="font-medium">Limitation of Liability</span>: We
              will not be liable for any damages of any kind arising from the
              use of our website, including but not limited to direct, indirect,
              incidental, punitive, and consequential damages.
            </li>
            <li className="mb-6">
              <span className="font-medium">Indemnification</span>: You agree to
              indemnify, defend, and hold harmless Filipino de Cuisine
              restaurant and its affiliates, officers, directors, employees,
              agents, and licensors from any claim, demand, or damage, including
              reasonable attorneys&apos; fees, arising out of your use of our
              website or your violation of these terms and conditions.
            </li>
            <li className="mb-6">
              <span className="font-medium">Modification of Terms</span>: We
              reserve the right to modify these terms and conditions at any time
              without prior notice. Your continued use of our website after any
              such changes constitutes your acceptance of the new terms and
              conditions.
            </li>
            <li>
              <span className="font-medium">Governing Law</span>: These terms
              and conditions are governed by and construed in accordance with
              the laws of the Philippines. Any dispute arising out of or related
              to these terms and conditions shall be resolved exclusively in the
              courts of the Philippines.
            </li>
            <li>
              <span className="font-medium">Refunds</span>: The absence of a
              refund policy means that customers will be responsible for their
              orders and reservations and will not be eligible for refunds or
              cancellations after the order and/or reservation is made and
              confirmed.
            </li>
          </ol>

          <h6>
            By using our website, you acknowledge that you have read,
            understood, and agree to be bound by these terms and conditions. If
            you do not agree to these terms and conditions, please do not use
            our website.
          </h6>
        </div>
      </div>
    </section>
  )
}

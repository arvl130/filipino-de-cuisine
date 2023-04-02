import Image from "next/image"
import Link from "next/link"

 export default function HeaderSection() {
    return <section className="terms-and-condition-header">
      <div className="termsandcondition">
          <div className="header">
            <div>
              <h4> Legal Terms </h4>
              <h1> Filipino de Cuisine Terms of Services </h1>
              <p>Last Update: March 25, 2023</p>
              </div>

            <div className="image">
            
               <Link href={"/privacy"}>
               <Image 
             src="/assets/terms-and-condition/symbol1.png"
             alt="next"
             width={40}
             height={40}
            
               />
               </Link>
      </div>
          </div>

          <div className="description">
              <p>
                1.  Information We Collect: We may collect personal information such as your name, email address, 
              phone number, and payment information when you make a reservation or order food through our 
              website. We also collect non-personal information such as your IP address and browser type when 
              you visit our website.
                <br></br> <br></br>
                2.  How We Use Your Information: We use your personal information to process your reservations and 
              orders, communicate with you about your reservations and orders, and improve our services. We 
              may also use your personal information to send you marketing communications, but only if you 
              have given us your consent to do so.
                <br></br> <br></br>
                3.  How We Disclose Your Information: We do not sell, rent, or disclose your personal 
                information to third parties without your consent, except as required by law. We may 
                disclose your personal information to our service providers who assist us in processing 
                your reservations and orders.
                <br></br> <br></br>
                4.  Cookies: We use cookies to improve your experience on our website: Cookies are small text 
                files that are stored on your device when you visit our website. We use both session cookies, 
                which expire when you close your browser, and persistent cookies, which remain on your device 
                until they expire or you delete them.
                <br></br> <br></br>
                5.  Security: We take reasonable measures to protect your personal information from unauthorized
                 access, use, or disclosure. However, no method of transmission over the Internet or electronic
                  storage is 100% secure, so we cannot guarantee absolute security.
                  <br></br> <br></br>
                6.  Third-Party Websites: Our website may contain links to third-party websites that are not 
                owned or controlled by Filipino de Cuisine Restaurant. We are not responsible for the content 
                or privacy practices of these websites. You acknowledge and agree that we shall not be liable 
                for any damages or losses arising from your use of these third-party websites.
                <br></br> <br></br>
                7. Children&apos;s Privacy: Our website is not intended for children under the age of 13, and we do 
                 not knowingly collect personal information from children under the age of 13. If we learn that
                 we have collected personal information from a child under the age of 13, we will promptly 
                 delete that information.
                 <br></br> <br></br>
                8. Changes to Privacy Policy: We reserve the right to modify or update this privacy policy at
                 any time without prior notice. Your continued use of our website after any such changes 
                 signifies your acceptance of the updated policy.
              </p>

          </div>
        </div>
        

    </section>
  }

  
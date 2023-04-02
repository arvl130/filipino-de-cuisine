import Image from "next/image"
import Link from "next/link"

export default function HeaderSection() {
  return <section className="privacy">
    <div className="privacy">
        <div className="header">
        <div className="image">
          <Link href={"/terms-and-condition"}>
      <Image
            src="/assets/privacy/symbol2.png"
            alt="previous"
            width={40}
            height={40}
            
          />

      </Link>
      </div>
      <div className="title">
            <h4> Legal Terms </h4>
            <h1> Filipino de Cuisine Privacy Policy </h1>
            <p>Last Update: March 25, 2023</p>
            </div>
        </div>

        <div className="description">
            <h6>
            Welcome to Filipino de Cuisine restaurant&apos;s website. By accessing or using our website, you 
            agree to be bound by the following terms and conditions:
            </h6>
            <p>
              1.  Use of Website Content: All content on our website, including but not limited to, text, 
              graphics, images, logos, and software is the property of Filipino de Cuisine restaurant and is 
              protected by applicable intellectual property laws. You may use the content only for your 
              personal, non-commercial use, and not for any other purpose without our express written consent.
              <br></br> <br></br>
              2. User Conduct: You agree to use our website only for lawful purposes and in a manner that does
               not infringe upon the rights of others or interfere with the operation of our website. You may 
               not upload, post, transmit, distribute, or otherwise publish any content that is unlawful, 
               harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of another&apos;s 
               privacy, or otherwise objectionable.
              <br></br> <br></br>
              3. Reservation: You may make a reservation for a table at our restaurant through our website. 
              All reservations are subject to availability and confirmation by Filipino de Cuisine restaurant.
              <br></br> <br></br>
              4. Payment: Payment for your meal at our restaurant will be processed in person at the 
              restaurant. We accept cash and major credit cards.
              <br></br> <br></br>
              5. Links to Third-Party Websites: Our website may contain links to third-party websites that are 
              not owned or controlled by Filipino de Cuisine restaurant. We are not responsible for the content
               or privacy practices of these websites and do not endorse or make any representations about them.
                <br></br> <br></br>
              6. Disclaimer of Warranties: We make no representations or warranties of any kind, express or 
              implied, regarding the operation of our website or the information, content, materials, or 
              products included on our website. You use our website at your own risk.
              <br></br> <br></br>
              7. Limitation of Liability: We will not be liable for any damages of any kind arising from the 
              use of our website, including but not limited to direct, indirect, incidental, punitive, and 
              consequential damages.
               <br></br> <br></br>
              8. Indemnification: You agree to indemnify, defend, and hold harmless Filipino de Cuisine 
              restaurant and its affiliates, officers, directors, employees, agents, and licensors from any 
              claim, demand, or damage, including reasonable attorneys&apos; fees, arising out of your use of our 
              website or your violation of these terms and conditions.
              <br></br> <br></br>
              9. Modification of Terms: We reserve the right to modify these terms and conditions at any 
              time without prior notice. Your continued use of our website after any such changes constitutes 
              your acceptance of the new terms and conditions.
              <br></br> <br></br>
              10. Governing Law: These terms and conditions are governed by and construed in accordance with 
              the laws of the Philippines. Any dispute arising out of or related to these terms and conditions 
              shall be resolved exclusively in the courts of the Philippines.
            </p>

            <h6>
            By using our website, you acknowledge that you have read, understood, and agree to be bound by 
            these terms and conditions. If you do not agree to these terms and conditions, please do not use 
            our website.
            </h6>

        </div>
      </div>
      

  </section>
}

import Image from "next/image"

export default function ContactUsPage() {
  return (
    <section className="contact-us">
      <div className="contact">
        <div className="contactus">
          <h6> Contact Us</h6>
          <h1>GET IN TOUCH</h1>
          <p>Feel free to contact us anytime. 
              <br></br>We will get back to you as possible as we can!</p>
            
        <div className="details">
          <div className="bg">
          <div className="img">
          <Image
              src="/assets/contact/LOCATION.png"
              width={50}
              height={50}
              alt="location"
            />
          </div>
          </div>

          <div className="location">
            <h1>Our Location</h1>
            <p>673 Quirino Highway, San Bartolome
              <br></br>
            Novaliches, Quezon City</p>
          </div>

          <div className="bg">
          <div className="img">
          <Image
              src="/assets/contact/BUSINESS.png"
              width={50}
              height={50}
              alt="business hours"
            />
          </div>
          </div>

          <div className="location">
            <h1>Phone Number</h1>
            <p>(02) 8806-3049</p>
          </div>

          <div className="bg">
          <div className="img">
          <Image
              src="/assets/contact/NUMBER.png"
              width={50}
              height={50}
              alt="phone number"
            />
          </div>
          </div>

          <div className="location">
            <h1>Business Hours</h1>
            <p>8:00 AM - 10:00 PM </p>
          </div>
        </div>

        
        </div>

        <div className="form">
          <div className="contactform">
            <form className="textbox">Name <br></br> <input className="name" type="text"></input>
            <br></br> <br></br>
            Email  <br></br> <input className="email" type="password"></input>
            <br></br> <br></br>
            Message <br></br>  <input className="message" type="message"></input>
            <br></br> <br></br>

            <button type="button"> <h4>Send</h4>  </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  )
}

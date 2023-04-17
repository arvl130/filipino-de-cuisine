import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().min(1),
})

type FormType = z.infer<typeof formSchema>

export default function ContactUsPage() {
  const { mutate: createMessage, isLoading } = api.message.create.useMutation({
    onSuccess: () =>
      reset({
        body: "",
        email: "",
        name: "",
      }),
  })
  const {
    reset,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  })

  return (
    <section className="contact-us">
      <div className="contact">
        <div className="contactus">
          <h6> Contact Us</h6>
          <h1>GET IN TOUCH</h1>
          <p>
            Feel free to contact us anytime.
            <br></br>We will get back to you as possible as we can!
          </p>

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
              <p>
                673 Quirino Highway, San Bartolome
                <br></br>
                Novaliches, Quezon City
              </p>
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
            <form
              className="textbox"
              onSubmit={handleSubmit((formData) => createMessage(formData))}
            >
              Name <br></br>{" "}
              <input className="name" type="text" {...register("name")}></input>
              <br></br> <br></br>
              Email <br></br>{" "}
              <input
                className="email"
                type="email"
                {...register("email")}
              ></input>
              <br></br> <br></br>
              Message <br></br>{" "}
              <input
                className="message"
                type="message"
                {...register("body")}
              ></input>
              <br></br> <br></br>
              <button
                type="submit"
                disabled={isLoading}
                className="text-white bg-emerald-500 disabled:bg-emerald-300 transition duration-200 w-full rounded-lg py-2 font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

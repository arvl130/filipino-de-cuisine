import { api } from "@/utils/api"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().min(1),
})

type FormType = z.infer<typeof formSchema>

function SuccessModal({ cancelFn }: { cancelFn: () => void }) {
  return (
    <div className="fixed inset-0 z-20 bg-black/20 flex justify-center items-center">
      <div className="bg-white max-w-sm w-full rounded-2xl px-8 py-6">
        <p className="text-center mb-3">
          We have received your message. We will get back to you shortly.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="px-6 pt-2 pb-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 transition duration-200 text-white rounded-md font-medium"
            onClick={() => cancelFn()}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ContactUsPage() {
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)
  const { mutate: createMessage, isLoading } = api.message.create.useMutation({
    onSuccess: () => {
      setIsSuccessModalVisible(true)
      reset({
        body: "",
        email: "",
        name: "",
      })
    },
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
    <section className="contact-us max-w-6xl mx-auto px-6 py-24">
      <div className="contact lg:grid lg:grid-cols-2">
        <section className="mb-12 lg:mb-0">
          <h2 className="text-2xl">Contact Us</h2>
          <p className="font-bold mb-3 text-4xl">GET IN TOUCH</p>
          <p className="text-lg">Feel free to contact us anytime.</p>
          <p className="text-lg mb-12">
            We will get back to you as possible as we can!
          </p>

          <article className="grid grid-cols-[auto_1fr] gap-6 items-center mb-8">
            <div className="w-24 aspect-square [box-shadow:_0px_4px_4px_2px_rgba(0,_0,_0,_0.25)] rounded-md bg-black flex justify-center items-center">
              <Image
                src="/assets/contact/LOCATION.png"
                width={50}
                height={50}
                alt="location"
              />
            </div>

            <div className="text-lg">
              <h3 className="font-semibold">Our Location</h3>
              <p>673 Quirino Highway, San Bartolome</p>
              <p>Novaliches, Quezon City</p>
            </div>
          </article>

          <article className="grid grid-cols-[auto_1fr] gap-6 items-center mb-8">
            <div className="w-24 aspect-square [box-shadow:_0px_4px_4px_2px_rgba(0,_0,_0,_0.25)] rounded-md bg-black flex justify-center items-center">
              <Image
                src="/assets/contact/NUMBER.png"
                width={50}
                height={50}
                alt="location"
              />
            </div>

            <div className="text-lg">
              <h3 className="font-semibold">Phone Number</h3>
              <p>(02) 8806-3049</p>
            </div>
          </article>

          <article className="grid grid-cols-[auto_1fr] gap-6 items-center">
            <div className="w-24 aspect-square [box-shadow:_0px_4px_4px_2px_rgba(0,_0,_0,_0.25)] rounded-md bg-black flex justify-center items-center">
              <Image
                src="/assets/contact/BUSINESS.png"
                width={50}
                height={50}
                alt="location"
              />
            </div>

            <div className="text-lg">
              <h3 className="font-semibold">Business Hours</h3>
              <p>8:00 AM - 10:00 PM</p>
            </div>
          </article>
        </section>

        <div className="form">
          <div className="contactform w-full px-6 py-6 sm:px-12 sm:py-12">
            <form
              className="textbox"
              onSubmit={handleSubmit((formData) => createMessage(formData))}
            >
              Name <br></br>{" "}
              <input
                className="bg-neutral-100 rounded w-full px-4 py-2"
                type="text"
                {...register("name")}
              ></input>
              <br></br> <br></br>
              Email <br></br>{" "}
              <input
                className="bg-neutral-100 rounded w-full px-4 py-2"
                type="email"
                {...register("email")}
              ></input>
              <br></br> <br></br>
              Message <br></br>{" "}
              <textarea
                className="bg-neutral-100 rounded w-full px-4 py-2 resize-none"
                {...register("body")}
              ></textarea>
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
      {isSuccessModalVisible && (
        <SuccessModal cancelFn={() => setIsSuccessModalVisible(false)} />
      )}
    </section>
  )
}

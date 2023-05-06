import { z } from "zod"

const { PAYMONGO_SECRET_KEY } = process.env

const paymentIntentSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.literal("payment_intent"),
    attributes: z.object({
      amount: z.number().min(10000).finite(),
      capture_type: z.union([z.literal("automatic"), z.literal("manual")]),
      client_key: z.string().length(59),
      currency: z.literal("PHP"),
      description: z.union([z.null(), z.string()]),
      livemode: z.boolean(),
      statement_descriptor: z.string(),
      status: z.union([
        z.literal("awaiting_payment_method"),
        z.literal("awaiting_next_action"),
        z.literal("processing"),
        z.literal("succeeded"),
      ]),
      payment_method_allowed: z
        .union([
          z.literal("atome"),
          z.literal("card"),
          z.literal("dob"),
          z.literal("billease"),
          z.literal("gcash"),
          z.literal("grab_pay"),
          z.literal("paymaya"),
        ])
        .array(),
      payments: z
        .object({
          id: z.string(),
          type: z.literal("payment"),
          attributes: z.object({
            access_url: z.union([z.null(), z.string()]), // Not in documentation.
            amount: z.number().min(10000),
            balance_transaction_id: z.union([z.null(), z.string()]), // Not in documentation.
            billing: z.union([
              z.null(),
              z.object({
                address: z.object({
                  city: z.string(),
                  country: z.string(),
                  line1: z.string(),
                  line2: z.string(),
                  postal_code: z.string(),
                  state: z.string(),
                }),
                email: z.string(),
                name: z.string(),
                phone: z.string(),
              }),
            ]),
            currency: z.literal("PHP"),
            description: z.union([z.null(), z.string()]),
            disputed: z.boolean(), // Not in documentation.
            external_reference_number: z.union([z.null(), z.string()]), // Not in documentation.
            fee: z.number(),
            livemode: z.boolean(),
            net_amount: z.number(),
            origin: z.literal("api"), // Not in documentation.
            payment_intent_id: z.string(), // Not in documentation.
            payout: z.union([z.null(), z.record(z.string(), z.any())]),
            source: z.object({
              id: z.string(),
              type: z.union([
                z.literal("atome"),
                z.literal("card"),
                z.literal("dob"),
                z.literal("billease"),
                z.literal("gcash"),
                z.literal("grab_pay"),
                z.literal("paymaya"),
              ]),
            }),
            statement_descriptor: z.string(),
            status: z.union([
              z.literal("pending"),
              z.literal("failed"),
              z.literal("paid"),
            ]),
            tax_amount: z.union([z.null(), z.any()]), // Not in documentation.
            metadata: z.union([z.null(), z.record(z.string(), z.any())]), // Not in documentation.
            refunds: z.any().array(), // Not in documentation.
            taxes: z.any().array(), // Not in documentation.
            available_at: z.number().optional(), // Not in documentation.
            created_at: z.number(),
            credited_at: z.union([z.null(), z.number()]), // Not in documentation.
            paid_at: z.number(),
            updated_at: z.number(),
          }),
        })
        .array(),
      last_payment_error: z.union([z.null(), z.record(z.string(), z.any())]),
      next_action: z.union([
        z.null(),
        z.object({
          type: z.literal("redirect"),
          redirect: z.object({
            url: z.string(),
            return_url: z.string(),
          }),
        }),
      ]),
      payment_method_options: z.union([
        z.null(),
        z.object({
          description: z.string(),
          statement_descriptor: z.string(),
          currency: z.literal("PHP"),
          capture_type: z.union([z.literal("automatic"), z.literal("manual")]),
        }),
      ]),
      metadata: z.union([z.null(), z.record(z.string(), z.any())]),
      setup_future_usage: z.union([
        z.null(),
        z.object({
          session_type: z.literal("on_session"),
          customer_id: z.string(),
        }),
      ]),
      created_at: z.number(),
      updated_at: z.number(),
    }),
  }),
})

export type PaymentIntent = z.infer<typeof paymentIntentSchema>

export async function createPaymentIntent(
  priceInCents: number
): Promise<PaymentIntent> {
  if (!PAYMONGO_SECRET_KEY)
    throw new Error("Missing or invalid Paymongo secret key")

  const response = await fetch("https://api.paymongo.com/v1/payment_intents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
        "base64"
      )}`,
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: priceInCents,
          payment_method_allowed: ["paymaya", "gcash"],
          payment_method_options: {
            card: {
              request_three_d_secure: "any",
            },
          },
          currency: "PHP",
          capture_type: "automatic",
        },
      },
    }),
  })

  const json = await response.json()
  return paymentIntentSchema.parse(json)
}

export async function getPaymentIntent(id: string): Promise<PaymentIntent> {
  if (!PAYMONGO_SECRET_KEY)
    throw new Error("Missing or invalid Paymongo secret key")

  const response = await fetch(
    `https://api.paymongo.com/v1/payment_intents/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
          "base64"
        )}`,
      },
    }
  )

  const json = await response.json()
  return paymentIntentSchema.parse(json)
}

const paymentMethodSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.literal("payment_method"),
    attributes: z.object({
      livemode: z.boolean(),
      type: z.union([
        z.literal("atome"),
        z.literal("card"),
        z.literal("dob"),
        z.literal("billease"),
        z.literal("gcash"),
        z.literal("grab_pay"),
        z.literal("paymaya"),
      ]),
      billing: z.union([
        z.null(),
        z.object({
          address: z.object({
            city: z.string(),
            country: z.string(),
            line1: z.string(),
            line2: z.string(),
            postal_code: z.string(),
            state: z.string(),
          }),
          email: z.string(),
          name: z.string(),
          phone: z.string(),
        }),
      ]),
      created_at: z.number(),
      updated_at: z.number(),
      details: z.union([
        z.null(),
        z.object({
          last4: z.string().length(4),
          exp_month: z.number().positive(),
          exp_year: z.number().positive(),
        }),
      ]),
      metadata: z.union([z.null(), z.record(z.string(), z.any())]),
    }),
  }),
})

type PaymentMethod = z.infer<typeof paymentMethodSchema>

export async function createPaymentMethod(
  paymentMethodType: "MAYA" | "GCASH"
): Promise<PaymentMethod> {
  if (!PAYMONGO_SECRET_KEY)
    throw new Error("Missing or invalid Paymongo public key")

  if (paymentMethodType === "MAYA") {
    const response = await fetch(
      "https://api.paymongo.com/v1/payment_methods",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
            "base64"
          )}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              type: "paymaya",
            },
          },
        }),
      }
    )

    const json = await response.json()
    return paymentMethodSchema.parse(json)
  } else if (paymentMethodType === "GCASH") {
    const response = await fetch(
      "https://api.paymongo.com/v1/payment_methods",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
            "base64"
          )}`,
        },
        body: JSON.stringify({
          data: {
            attributes: {
              type: "gcash",
            },
          },
        }),
      }
    )

    const json = await response.json()
    return paymentMethodSchema.parse(json)
  }

  throw new Error("Invalid payment method type.")
}

export async function attachPaymentMethodToIntent(
  methodId: string,
  intentId: string,
  returnUrl: string
): Promise<PaymentIntent> {
  if (!PAYMONGO_SECRET_KEY)
    throw new Error("Missing or invalid Paymongo secret key")

  const body = JSON.stringify({
    data: {
      attributes: {
        payment_method: methodId,
        return_url: returnUrl,
      },
    },
  })
  const response = await fetch(
    `https://api.paymongo.com/v1/payment_intents/${intentId}/attach`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
          "base64"
        )}`,
      },
      body,
    }
  )

  const json = await response.json()
  return paymentIntentSchema.parse(json)
}

const sourceSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.literal("source"),
    attributes: z.object({
      amount: z.number().min(10000).finite(),
      billing: z.union([
        z.null(),
        z.object({
          address: z.object({
            city: z.string(),
            country: z.string(),
            line1: z.string(),
            line2: z.string(),
            postal_code: z.string(),
            state: z.string(),
          }),
          email: z.string(),
          name: z.string(),
          phone: z.string(),
        }),
      ]),
      currency: z.literal("PHP"),
      description: z.union([z.null(), z.string()]),
      livemode: z.boolean(),
      statement_descriptor: z.string(),
      status: z.union([
        z.literal("pending"),
        z.literal("chargeable"),
        z.literal("cancelled"),
        z.literal("expired"),
        z.literal("paid"),
      ]),
      type: z.union([
        // Should only support this two according to documentation.
        z.literal("gcash"),
        z.literal("grab_pay"),
        // But based on our testing, it should also support this.
        z.literal("paymaya"),
      ]),
      redirect: z.object({
        checkout_url: z.string(),
        failed: z.string(),
        success: z.string(),
      }),
      metadata: z.union([z.null(), z.record(z.string(), z.any())]),
      created_at: z.number(),
      updated_at: z.number(),
    }),
  }),
})

type sourceType = z.infer<typeof sourceSchema>

export async function getSource(id: string): Promise<sourceType> {
  if (!PAYMONGO_SECRET_KEY)
    throw new Error("Missing or invalid Paymongo secret key")

  const response = await fetch(`https://api.paymongo.com/v1/sources/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString(
        "base64"
      )}`,
    },
  })

  const json = await response.json()
  return sourceSchema.parse(json)
}

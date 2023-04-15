import { prisma } from "@/server/db"
import { Order } from "@prisma/client"
import { PrismaClientValidationError } from "@prisma/client/runtime/data-proxy"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  paymentIntentId: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string
    order?: Order
    error?: unknown
  }>
) {
  try {
    const { data } = req.body
    const { paymentIntentId } = inputSchema.parse({
      paymentIntentId: data.attributes.data.attributes.payment_intent_id,
    })

    const onlineOrder = await prisma.onlineOrder.findUnique({
      where: {
        paymentIntentId,
      },
    })

    if (!onlineOrder) {
      // Keep this on status 200 for now, so that we don't accidentally
      // cause the web hook to keep pinging here when no order is found.
      res.json({
        message: "Could not find",
      })
      return
    }

    const order = await prisma.order.update({
      where: {
        id: onlineOrder.id,
      },
      data: {
        paymentStatus: "Fulfilled",
      },
    })

    res.json({
      message: "Payment status updated",
      order,
    })
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({
        message: "Input validation error occured",
        error: e.message,
      })
      return
    }

    if (e instanceof PrismaClientValidationError) {
      res.status(500).json({
        message: "Database validation error occured",
        error: e.message,
      })
      return
    }

    res.status(500).json({
      message: "Unknown error occured",
      error: e,
    })
  }
}

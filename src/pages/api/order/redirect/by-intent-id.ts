import { prisma } from "@/server/db"
import { PrismaClientValidationError } from "@prisma/client/runtime/data-proxy"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  paymentIntentId: z.string().length(27),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string
    error?: unknown
  }>
) {
  try {
    const { payment_intent_id } = req.query
    const { paymentIntentId } = inputSchema.parse({
      paymentIntentId: payment_intent_id,
    })

    const onlineOrder = await prisma.onlineOrder.findUnique({
      where: {
        paymentIntentId,
      },
    })

    if (!onlineOrder) {
      res.status(404).json({
        message: "No such order for given payment intent ID",
      })
      return
    }

    res.status(200).redirect(`/order/${onlineOrder.id}`)
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

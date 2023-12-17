import { prisma } from "@/server/db"
import { Order, Reservation } from "@prisma/client"
import { PrismaClientValidationError } from "@prisma/client/runtime/library"
import type { NextApiRequest, NextApiResponse } from "next"
import { ZodError, z } from "zod"

const inputSchema = z.object({
  paymentIntentId: z.string(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        message: string
        order: Order
      }
    | {
        message: string
        reservation: Reservation
      }
    | {
        message: string
        error?: unknown
      }
  >
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

    if (onlineOrder) {
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
      return
    }

    const reservation = await prisma.reservation.findUnique({
      where: {
        paymentIntentId,
      },
    })

    if (reservation) {
      const updatedReservation = await prisma.reservation.update({
        where: {
          id: reservation.id,
        },
        data: {
          paymentStatus: "Fulfilled",
        },
      })

      res.json({
        message: "Payment status updated",
        reservation: updatedReservation,
      })
      return
    }

    res.status(404).json({
      message: "No such order or reservation for given payment",
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

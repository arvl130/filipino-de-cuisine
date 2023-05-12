import { Discount, DiscountItem, MenuItem } from "@prisma/client"
import Decimal from "decimal.js"

export function getDiscountedPrice(
  menuItem: MenuItem & {
    discountItems: (DiscountItem & {
      discount: Discount
    })[]
  },
  givenDate?: Date
) {
  const date = givenDate !== undefined ? givenDate : new Date()
  const activeDiscountItems = menuItem.discountItems.filter((discountItem) => {
    if (
      date.getTime() >= discountItem.discount.startAt.getTime() &&
      date.getTime() <= discountItem.discount.endAt.getTime()
    ) {
      return true
    }

    return false
  })
  const activeDiscounts = activeDiscountItems.map(
    (activeDiscountItem) => activeDiscountItem.discount
  )
  const discountTotal = activeDiscounts.reduce(
    (runningTally, activeDiscount) =>
      activeDiscount.amount.plus(new Decimal(runningTally)).toNumber(),
    0
  )
  const discountAmount = menuItem.price.toNumber() * discountTotal
  const discountedPrice =
    discountAmount > menuItem.price.toNumber()
      ? 0
      : menuItem.price.toNumber() - discountAmount

  return {
    originalPrice: menuItem.price.toNumber(),
    hasDiscount: activeDiscounts.length > 0,
    discountedPrice,
  }
}

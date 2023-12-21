import SuperJSON from "superjson"
import { Decimal } from "decimal.js"

SuperJSON.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  "decimal.js"
)

export const SuperJsonWithDecimal = SuperJSON

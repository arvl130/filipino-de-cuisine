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

// Whenever we want to use SuperJSON, we import from here so that
// we can make sure custom types are registered in the SuperJSON
// instance.
export const SuperJsonWithDecimal = SuperJSON

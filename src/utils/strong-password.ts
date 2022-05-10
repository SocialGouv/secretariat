import { randomInt } from "crypto"
import { generate } from "generate-password"

const strongPassword = () =>
  generate({
    length: randomInt(12, 21),
    numbers: true,
    symbols: true,
    strict: true,
  })

export default strongPassword

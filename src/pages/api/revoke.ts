import { NextApiRequest, NextApiResponse } from "next"
import revoke from "@/services/revoke"
import SERVICES from "@/utils/SERVICES"
import { getToken } from "next-auth/jwt"
import { decode } from "@/utils/jwt"

const Revoke = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("REQ")
  console.log(req)
  console.log("COOKIES")
  console.log(req.cookies)
  const token = await getToken({ req, decode })
  console.log("TOKEN")
  console.log(token)
  if (token) {
    const { accountServiceID, accountID, serviceName } = req.body.input.data
    if (SERVICES.includes(serviceName)) {
      res
        .status(200)
        .json(await revoke(accountServiceID, accountID, serviceName))
    } else {
      res.status(400).json({ message: "unknown service name" })
    }
  } else {
    res.status(403).json({ message: "unauthorized" })
  }
}

export default Revoke

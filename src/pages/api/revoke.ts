import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import revoke from "@/services/revoke"
import SERVICES from "@/utils/SERVICES"

const Revoke = async (req: NextApiRequest, res: NextApiResponse) => {
  if (await getSession({ req })) {
    const { accountServiceID, accountID, serviceName } = req.body
    console.log(serviceName)
    if (SERVICES.includes(serviceName)) {
      const { status, body } = await revoke(
        accountServiceID,
        accountID,
        serviceName
      )
      res.status(status).send(body)
    } else {
      res.status(400).send("unknown service name")
    }
  } else {
    res.status(403).end()
  }
}

export default Revoke

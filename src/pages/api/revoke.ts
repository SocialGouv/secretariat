import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import revoke from "@/services/revoke"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  if (await getSession({ req })) {
    const { accountServiceID, accountID, serviceName } = req.body
    const { status, body } = await revoke(
      accountServiceID,
      accountID,
      serviceName
    )
    res.status(status).send(body)
  } else {
    res.status(403).end()
  }
}

export default Endpoint

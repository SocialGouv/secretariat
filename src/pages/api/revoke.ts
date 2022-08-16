import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import revoke from "@/services/revoke"
import SERVICES from "@/utils/SERVICES"
import logAction from "@/utils/log-action"
import { getJwt } from "@/utils/jwt"

const Revoke = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (session) {
    logAction(
      getJwt("user"),
      session.user.login,
      "revoke",
      JSON.stringify(req.body)
    )

    const { accountServiceID, accountID, serviceName } = req.body
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

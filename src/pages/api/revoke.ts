import { NextApiRequest, NextApiResponse } from "next"
import revoke from "@/services/revoke"
import SERVICES from "@/utils/SERVICES"
import { getToken } from "next-auth/jwt"
import { COOKIE_NAME, decode, getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"

const Revoke = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE")
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  const userToken = await getToken({ req, decode, cookieName: COOKIE_NAME })

  if (!userToken) {
    res.status(403).json({ message: "Unauthorized" })
    return
  }

  logAction({
    action: "revoke",
    user: userToken.user.login,
    token: getJwt(),
    parameters: JSON.stringify(req.body.input.data),
  })

  const { accountServiceID, accountID, serviceName } = req.body.input.data
  if (SERVICES.includes(serviceName)) {
    res.status(200).json(await revoke(accountServiceID, accountID, serviceName))
  } else {
    res.status(400).json({ message: "unknown service name" })
  }
}

export default Revoke

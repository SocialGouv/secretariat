import sync from "@/services/sync"
import httpLogger from "@/utils/http-logger"
import { getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import SERVICES from "@/utils/SERVICES"
import type { NextApiRequest, NextApiResponse } from "next"

const Sync = async (req: NextApiRequest, res: NextApiResponse) => {
  httpLogger(req, res)
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  let { services } = req.body
  if (!services) {
    services = SERVICES
  }

  logAction({
    action: "sync",
    token: getJwt(),
    parameters: JSON.stringify({ services }),
  })

  sync(
    services.filter((service: keyof ServiceAccountsMapping) =>
      SERVICES.includes(service)
    )
  )
  res.status(200).json({ message: "sync started" })
}

export default Sync

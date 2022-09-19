import sync from "@/services/sync"
import { getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import SERVICES from "@/utils/SERVICES"
import type { NextApiRequest, NextApiResponse } from "next"

const Sync = async (req: NextApiRequest, res: NextApiResponse) => {
  let services

  if (req.method === "GET") {
    services = SERVICES
  } else if (req.method === "POST") {
    ;({ services } = req.body)
    if (!services) {
      services = SERVICES
    }
  } else {
    res.setHeader("Allow", "GET, POST")
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  logAction({
    action: "sync",
    token: getJwt(),
    parameters: JSON.stringify({ services }),
  })

  sync(services.filter((service: any) => SERVICES.includes(service)))
  res.status(200).json({ message: "sync started" })
}

export default Sync

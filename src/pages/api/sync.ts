import sync from "@/services/sync"
import { getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import type { NextApiRequest, NextApiResponse } from "next"

const Sync = async (_req: NextApiRequest, res: NextApiResponse) => {
  logAction({ action: "sync", token: getJwt() })
  sync()
  res.status(200).json({ message: "sync started" })
}

export default Sync

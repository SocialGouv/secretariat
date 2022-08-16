import sync from "@/services/sync"
import { getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import type { NextApiRequest, NextApiResponse } from "next"

const Sync = async (_req: NextApiRequest, res: NextApiResponse) => {
  logAction(await getJwt("user"), null, "sync")
  sync()
  res.status(202).end()
}

export default Sync

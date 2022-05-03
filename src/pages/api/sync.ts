import sync from "@/services/sync"
import type { NextApiRequest, NextApiResponse } from "next"

const Sync = async (_req: NextApiRequest, res: NextApiResponse) => {
  sync()
  res.status(202).end()
}

export default Sync

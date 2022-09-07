import sync from "@/services/sync"
import type { NextApiRequest, NextApiResponse } from "next"

const Sync = async (_req: NextApiRequest, res: NextApiResponse) => {
  sync()
  res.status(200).json({ message: "sync started" })
}

export default Sync

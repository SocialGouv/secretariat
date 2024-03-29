import httpLogger from "@/utils/http-logger"
import { NextApiRequest, NextApiResponse } from "next"

const Report = (req: NextApiRequest, res: NextApiResponse) => {
  httpLogger(req, res)
  res.status(200).end()
}

export default Report

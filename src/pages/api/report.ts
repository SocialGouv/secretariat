import httpLogger from "@/utils/http-logger"
import logger from "@/utils/logger"
import { NextApiRequest, NextApiResponse } from "next"

const Report = (req: NextApiRequest, res: NextApiResponse) => {
  httpLogger(req, res)
  logger.info({ body: req.body })
  res.status(200).end()
}

export default Report

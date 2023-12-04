import { NextApiRequest, NextApiResponse } from "next"

const Report = (req: NextApiRequest, res: NextApiResponse) => {
  throw new Error("serve error")
  res.status(200).end()
}

export default Report

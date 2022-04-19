import { NextApiRequest, NextApiResponse } from "next"
import { deleteOvhAccount } from "@/services/delete-account"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.query
  const status = await deleteOvhAccount(email as string)
  res.status(status).end()
}

export default Endpoint

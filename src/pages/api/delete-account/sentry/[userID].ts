import { NextApiRequest, NextApiResponse } from "next"
import { deleteSentryAccount } from "@/services/delete-account"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userID } = req.query
  const { status, body } = await deleteSentryAccount(userID as string)
  res.status(status).send(body)
}

export default Endpoint

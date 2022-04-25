import { NextApiRequest, NextApiResponse } from "next"
import { deleteZammadAccount } from "@/services/delete-account"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userID } = req.query
  const { status, body } = await deleteZammadAccount(userID as string)
  res.status(status).send(body)
}

export default Endpoint

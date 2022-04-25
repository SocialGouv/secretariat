import { NextApiRequest, NextApiResponse } from "next"
import { deleteNextcloudAccount } from "@/services/delete-account"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userID } = req.query
  const { status, body } = await deleteNextcloudAccount(userID as string)
  res.status(status).send(body)
}

export default Endpoint

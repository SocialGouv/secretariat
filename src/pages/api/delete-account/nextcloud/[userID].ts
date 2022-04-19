import { NextApiRequest, NextApiResponse } from "next"
import { deleteNextcloudAccount } from "@/services/delete-account"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userID } = req.query
  const status = await deleteNextcloudAccount(userID as string)
  res.status(status === 100 ? 200 : 500).end()
}

export default Endpoint

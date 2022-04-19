import { NextApiRequest, NextApiResponse } from "next"
import { deleteMattermostAccount } from "@/services/delete-account"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userID } = req.query
  const status = await deleteMattermostAccount(userID as string)
  res.status(status).end()
}

export default Endpoint

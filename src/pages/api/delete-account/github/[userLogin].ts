import { NextApiRequest, NextApiResponse } from "next"
import { deleteGithubAccount } from "@/services/delete-account"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userLogin } = req.query
  const { status, body } = await deleteGithubAccount(userLogin as string)
  res.status(status).send(body)
}

export default Endpoint

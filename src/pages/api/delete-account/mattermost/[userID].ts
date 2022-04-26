import { NextApiRequest, NextApiResponse } from "next"
import { deleteMattermostAccount } from "@/services/delete-account"
import { getSession } from "next-auth/react"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  if (await getSession({ req })) {
    const { userID } = req.query
    const { status, body } = await deleteMattermostAccount(userID as string)
    res.status(status).send(body)
  } else {
    res.status(403).end()
  }
}

export default Endpoint

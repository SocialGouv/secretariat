import onboard from "@/services/onboard"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

const Review = async (req: NextApiRequest, res: NextApiResponse) => {
  if (await getSession({ req })) {
    res.status(200).json(await onboard(req.body))
  } else {
    res.status(403).end()
  }
}

export default Review

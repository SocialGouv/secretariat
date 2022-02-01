import { getJwt } from "@/utils/jwt"
import { NextApiRequest, NextApiResponse } from "next"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = getJwt()
  res.status(200).json({ token })
}

export default Endpoint

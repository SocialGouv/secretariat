import { getJwt } from "@/utils/jwt"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  console.log("Session : ", session)

  const token = getJwt()
  res.status(200).json({ token })
}

export default Endpoint

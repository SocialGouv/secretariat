import { getJwt } from "@/utils/jwt"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  const { user: { role, teams } = { role: "anonymous", teams: [] } } =
    session || {}

  const token = getJwt(role, teams)

  res.status(200).json({ token })
}

export default Endpoint

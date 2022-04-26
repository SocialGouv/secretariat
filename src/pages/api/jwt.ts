import { getJwt } from "@/utils/jwt"
import { getSession } from "next-auth/react"

import type { NextApiRequest, NextApiResponse } from "next"

const Endpoint = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  const { user: { role, teams } = { role: "anonymous", teams: [] } } =
    session || {}

  const token = getJwt(role, teams)

  res.status(200).json({ token })
}

export default Endpoint

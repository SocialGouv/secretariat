import { getJwt } from "@/utils/jwt"
import { getSession } from "next-auth/react"

import type { NextApiRequest, NextApiResponse } from "next"

const Jwt = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  const { user: { role } = { role: "anonymous" } } = session || {}

  const token = getJwt(role)

  res.status(200).json({ token })
}

export default Jwt

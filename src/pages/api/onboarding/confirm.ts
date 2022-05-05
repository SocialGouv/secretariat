import { NextApiRequest, NextApiResponse } from "next"

import { getJwt } from "@/utils/jwt"
import fetcher from "@/utils/fetcher"
import { confirmOnboardingRequest } from "@/queries/index"

const Confirm = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  const token = getJwt("admin")
  await fetcher(confirmOnboardingRequest, token, {
    cols: { id },
    data: { confirmed: true },
  })
  res.redirect("http://localhost:3000/onboarding/confirm")
}

export default Confirm

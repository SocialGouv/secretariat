import { onboard } from "@/services/onboard"
import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

const Onboard = async (req: NextApiRequest, res: NextApiResponse) => {
  if (await getSession({ req })) {
    const onboardingData: OnboardingData = req.body
    const serviceResponses = await onboard(onboardingData)
    res.status(200).json(serviceResponses)
  } else {
    res.status(403).end()
  }
}

export default Onboard

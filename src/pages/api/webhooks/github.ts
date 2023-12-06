import type { NextApiRequest, NextApiResponse } from "next"

const GithubWebhook = async (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(400).json({ message: "disabled" })
  return
}

export default GithubWebhook

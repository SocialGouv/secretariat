import { getUser, updateUser } from "@/queries/index"
import { enableGithubAccount } from "@/services/enable/github"
import graphQLFetcher from "@/utils/graphql-fetcher"
import httpLogger from "@/utils/http-logger"
import { COOKIE_NAME, decode, getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import logger from "@/utils/logger"
import statusOk from "@/utils/status-ok"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { z } from "zod"

const Enable = async (req: NextApiRequest, res: NextApiResponse) => {
  httpLogger(req, res)
  if (req.method !== "PUT") {
    res.setHeader("Allow", "PUT")
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  const userToken = await getToken({ req, decode, cookieName: COOKIE_NAME })

  if (!userToken) {
    res.status(403).json({ message: "Unauthorized" })
    return
  }

  const bodySchema = z.object({
    id: z.string(),
  })
  const parsedBody = bodySchema.safeParse(req.body)
  if (!parsedBody.success) {
    logger.error(parsedBody.error)
    res.status(400).json({ message: "Bad Request" })
    return
  }

  const token = getJwt()

  logAction({
    action: "disable",
    user: userToken.user.login,
    token,
    parameters: JSON.stringify(parsedBody),
  })

  const { users_by_pk: user }: { users_by_pk: User } = await graphQLFetcher({
    query: getUser,
    token,
    parameters: { id: parsedBody.data.id },
  })

  // Only handling Github for now
  const githubAccount = user.services.find(
    (account) => account.type === "github"
  ) as GithubServiceAccount | undefined
  if (!githubAccount) {
    logger.error("No Github service associated with this user")
    res.status(400).json({ message: "Bad Request" })
    return
  }

  const response = await enableGithubAccount(githubAccount.data.login)
  if (statusOk(response.status)) {
    await graphQLFetcher({
      query: updateUser,
      token,
      parameters: { id: user.id, _set: { disabled: false } },
    })
    res.status(200).json({ status: 200, body: "user enabled successfully" })
  } else {
    const responseData = {
      user,
      account: githubAccount,
      response: {
        status: response.status,
        body: await response.json(),
      },
    }
    logger.error(responseData, "error enabling Github account")
    res.status(400).json({ message: "error enabling Github account" })
  }
}

export default Enable

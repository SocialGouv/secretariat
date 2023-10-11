import { getUser, updateUser } from "@/queries/index"
import { enable } from "@/services/enable"
import graphQLFetcher from "@/utils/graphql-fetcher"
import httpLogger from "@/utils/http-logger"
import { COOKIE_NAME, decode, getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import logger from "@/utils/logger"
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
    action: "enable",
    user: userToken.user.login,
    token,
    parameters: JSON.stringify(parsedBody),
  })

  const { users_by_pk: user }: { users_by_pk: User } = await graphQLFetcher({
    query: getUser,
    token,
    parameters: { id: parsedBody.data.id },
  })

  const responses = await enable(user)

  if (responses.some((response) => !response || !response.success)) {
    const data = {
      user,
      responses,
    }
    logger.error(data, "error enabling user")
    res.status(400).json("error enabling user")
  } else {
    await graphQLFetcher({
      query: updateUser,
      token,
      parameters: { id: user.id, _set: { disabled: false } },
    })
    res.status(200).json({ status: 200, body: "user enabled successfully" })
  }
}

export default Enable

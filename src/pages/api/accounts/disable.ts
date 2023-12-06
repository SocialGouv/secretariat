import { getService, updateService } from "@/queries/index"
import { disableGithubAccount } from "@/services/disablers/github"
import { disableMattermostAccount } from "@/services/disablers/mattermost"
import { disableOvhAccount } from "@/services/disablers/ovh"
import graphQLFetcher from "@/utils/graphql-fetcher"
import httpLogger from "@/utils/http-logger"
import { COOKIE_NAME, decode, getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import logger from "@/utils/logger"
import statusOk from "@/utils/status-ok"
import { NextApiRequest, NextApiResponse } from "next"
import { getToken } from "next-auth/jwt"
import { z } from "zod"

const Disable = async (req: NextApiRequest, res: NextApiResponse) => {
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
    id: z.string().uuid(),
  })
  const parsedBody = bodySchema.safeParse(req.body.input.data)
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

  const { services_by_pk: serviceAccount } = await graphQLFetcher({
    query: getService,
    token,
    parameters: { id: parsedBody.data.id },
  })

  if (!serviceAccount) {
    res.status(400).json({ message: "could not find account for this id" })
    return
  }
  if (serviceAccount.disabled) {
    res.status(400).json({ message: "account already disabled" })
    return
  }

  let response: APIResponse
  if (serviceAccount.type === "mattermost") {
    const r = await disableMattermostAccount(serviceAccount.data.id)
    response = { status: r.status, body: await r.json() }
  } else if (serviceAccount.type === "github") {
    const r = await disableGithubAccount(serviceAccount.data.login)
    response = { status: r.status, body: await r.text() } // Github does not always send valid JSON
  } else if (serviceAccount.type == "ovh") {
    const r = await disableOvhAccount(serviceAccount.data.primaryEmailAddress)
    response = {
      status: r.success ? 200 : 500,
      body: r.success ? (r.data as string) : JSON.stringify(r.error),
    }
  } else {
    logger.error(
      { id: parsedBody.data.id },
      "could not disable this account, service not supported"
    )
    res.status(400).json({
      message: "could not disable this account, service not supported",
    })
    return
  }

  if (statusOk(response.status)) {
    await graphQLFetcher({
      query: updateService,
      token,
      parameters: {
        serviceId: serviceAccount.id,
        service: { disabled: true },
      },
    })
  }
  res.status(200).json(response)
}

export default Disable

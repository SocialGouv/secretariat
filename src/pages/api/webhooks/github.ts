import {
  deleteService,
  getServiceFromData,
  upsertService,
} from "@/services/sync"
import httpLogger from "@/utils/http-logger"
import { getJwt } from "@/utils/jwt"
import logAction from "@/utils/log-action"
import logger from "@/utils/logger"
import type { NextApiRequest, NextApiResponse } from "next"

const GithubWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  httpLogger(req, res)
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  if (!req.body.action) {
    res.status(400).end()
    return
  }

  const { action, scope } = req.body
  const token = getJwt()
  if (action === "member_added") {
    logger.info("Syncing new Github service from webhook")
    const {
      membership: {
        role,
        user: { node_id: id, name, email, login, avatar_url: avatarUrl },
      },
    } = req.body
    const user = { id, name, email, login, avatarUrl }
    await upsertService({ ...user, role }, "github", token)
    logAction({
      action: "webhooks/github/org/member-added",
      token,
      parameters: JSON.stringify({ ...user, role }),
    })
  } else if (action === "member_removed") {
    logger.info("Deleting Github service from webhook")
    const {
      membership: {
        role,
        user: { node_id: id, name, email, login, avatar_url: avatarUrl },
      },
    } = req.body
    const user = { id, name, email, login, avatarUrl }
    await deleteService({ ...user, role }, "github", token)
    logAction({
      action: "webhooks/github/org/member-removed",
      token,
      parameters: JSON.stringify({ ...user, role }),
    })
  } else if (scope === "team" && action === "added") {
    logger.info("Adding team to Github user from webhook")
    const {
      member: { node_id: id, name, email, login, avatar_url: avatarUrl },
      team: { slug: teamSlug, name: teamName, id: teamId },
    } = req.body
    const user = { id, name, login, email, avatarUrl }
    const team = { slug: teamSlug, name: teamName, id: teamId }
    const servicesMatchingId = await getServiceFromData(user, "github", token)
    if (servicesMatchingId.length !== 1) {
      const error =
        "Could not find a unique Github user to update with new team"
      logger.error({ user }, error)
      res.status(400).json({ error })
      return
    } else {
      await upsertService(
        {
          ...servicesMatchingId[0].data,
          ...user,
          teams: servicesMatchingId[0].data.teams
            ? [
                ...(servicesMatchingId[0].data.teams as Record<
                  string,
                  unknown
                >[]),
                team,
              ].filter(
                (item, index, array) =>
                  index === array.findIndex((i) => i.id === item.id)
              )
            : [team],
        },
        "github",
        token
      )
      logAction({
        action: "webhooks/github/teams/member-added",
        token,
        parameters: JSON.stringify({ user, team }),
      })
    }
  } else if (scope === "team" && action === "removed") {
    logger.info("Removing team from Github user from webhook")
    const {
      member: { node_id: id, name, email, login, avatar_url: avatarUrl },
      team: { slug: teamSlug, name: teamName, id: teamId },
    } = req.body
    const user = { id, name, email, login, avatarUrl }
    const team = { slug: teamSlug, name: teamName, id: teamId }
    const servicesMatchingId = await getServiceFromData(user, "github", token)
    if (servicesMatchingId.length !== 1) {
      logger.error(
        { user },
        "Could not find a unique Github user to update with removed team"
      )
    } else {
      await upsertService(
        {
          ...servicesMatchingId[0].data,
          ...user,
          teams: servicesMatchingId[0].data.teams
            ? servicesMatchingId[0].data.teams.filter(
                (item: Record<string, unknown>) => team.id !== item.id
              )
            : [team],
        },
        "github",
        token
      )
      logAction({
        action: "webhooks/github/teams/member-removed",
        token,
        parameters: JSON.stringify({ user, team }),
      })
    }
  } else {
    logger.info({ action, scope }, "Unsupported event")
  }
  res.status(200).end()
}

export default GithubWebhook

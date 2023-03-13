import { fetchGithubUsers } from "@/services/fetchers/github"
import { fetchMatomoUsers } from "@/services/fetchers/matomo"
import { fetchMattermostUsers } from "@/services/fetchers/mattermost"
import { fetchNextcloudUsers } from "@/services/fetchers/nextcloud"
import { fetchOvhUsers } from "@/services/fetchers/ovh"
import { fetchSentryUsers } from "@/services/fetchers/sentry"
import { fetchZammadUsers } from "@/services/fetchers/zammad"
import graphQLFetcher from "@/utils/graphql-fetcher"
import { getJwt } from "@/utils/jwt"
import logger from "@/utils/logger"
import {
  deleteServices,
  deleteUsers,
  getServicesMatchingId,
  insertService,
  insertUser,
  updateService,
} from "../queries"

const DEFAULT_DELAY = 800

const servicesFetchers: Record<ServiceName, any> = {
  github: fetchGithubUsers,
  matomo: fetchMatomoUsers,
  mattermost: fetchMattermostUsers,
  nextcloud: fetchNextcloudUsers,
  ovh: fetchOvhUsers,
  sentry: fetchSentryUsers,
  zammad: fetchZammadUsers,
}

const servicesIdFields: Record<ServiceName, string> = {
  github: "id",
  matomo: "email", // This API does not return any unique ID in entries
  zammad: "id",
  sentry: "id",
  nextcloud: "id",
  mattermost: "id",
  ovh: "id",
}

const upsertService = async (
  serviceData: Record<string, unknown>,
  serviceName: ServiceName,
  token: string,
  stats: syncStats
): Promise<string> => {
  const idField = servicesIdFields[serviceName]
  const { services: servicesMatchingId } = await graphQLFetcher({
    query: getServicesMatchingId,
    token,
    parameters: {
      idKeyValue: { [idField]: serviceData[idField] },
      serviceName,
    },
  })
  if (servicesMatchingId.length === 0) {
    // This is a new service entry, we have to insert it into the table

    // First, create an associated user entry
    const {
      insert_users_one: { id: userId },
    } = await graphQLFetcher({ query: insertUser, token })

    // Then, create the service entry
    const {
      insert_services_one: { id: serviceId },
    } = await graphQLFetcher({
      query: insertService,
      token,
      parameters: {
        service: { data: serviceData, user_id: userId, type: serviceName },
      },
    })
    stats.insertions += 1
    return serviceId
  } else if (servicesMatchingId.length === 1) {
    // We have to update a service entry
    const {
      update_services_by_pk: { id: serviceId },
    } = await graphQLFetcher({
      query: updateService,
      token,
      parameters: {
        serviceId: servicesMatchingId[0].id,
        service: { data: serviceData },
      },
    })
    stats.updates += 1
    return serviceId
  } else {
    logger.error(
      { servicesMatchingId },
      "Got multiple matches with a service's primary key field and service name"
    )
    stats.errors += 1
    return ""
  }
}

const updateUsers = async (
  users: Record<string, unknown>[],
  serviceName: ServiceName,
  token: string,
  stats: syncStats
): Promise<string[]> => {
  const existingServicesIds: string[] = []
  for (const userKey in users) {
    const serviceId = await upsertService(
      users[userKey],
      serviceName,
      token,
      stats
    )
    if (serviceId !== "") existingServicesIds.push(serviceId)
  }
  return existingServicesIds
}

const clearDeletedServices = async (
  existingServicesIds: Record<string, string[]>,
  token: string
) => {
  const affectedUsers = []
  for (const serviceName in existingServicesIds) {
    const {
      delete_services: { returning: affectedUsersForService },
    } = await graphQLFetcher({
      query: deleteServices,
      token,
      parameters: {
        existingServicesIds: existingServicesIds[serviceName],
        serviceName,
      },
    })
    affectedUsers.push(...affectedUsersForService)
  }

  return affectedUsers
}

const deleteOrphanUsers = async (
  affectedUsers: {
    users: {
      id: string
      services_aggregate: { aggregate: { count: number } }
    }
  }[],
  token: string
) => {
  const {
    delete_users: { affected_rows: deletedUsers },
  } = await graphQLFetcher({
    query: deleteUsers,
    token,
    parameters: {
      userIds: affectedUsers
        .filter((user) => user.users.services_aggregate.aggregate.count === 0)
        .map((user) => user.users.id),
    },
  })
  return deletedUsers
}

const sync = async (enabledServices: ServiceName[]) => {
  logger.info({ enabledServices }, "started sync")

  const token = getJwt()

  const stats: syncStats = {
    insertions: 0,
    updates: 0,
    errors: 0,
    userDeletions: 0,
    accountDeletions: 0,
  }

  // Remember the users list for all services, to clean the deleted users afterwards
  const existingServicesIds: Record<string, string[]> = {}
  for (const serviceName of enabledServices) {
    existingServicesIds[serviceName] = []
  }

  // Fetch data for all services asynchronously
  const dataByService: Record<string, Record<string, unknown>[]> = {}
  await Promise.all(
    enabledServices.map(async (serviceName) => {
      dataByService[serviceName] = await servicesFetchers[serviceName](
        DEFAULT_DELAY
      )
    })
  )

  // Update the DB synchronously
  for (const serviceName of enabledServices) {
    existingServicesIds[serviceName].push(
      ...(await updateUsers(
        dataByService[serviceName],
        serviceName,
        token,
        stats
      ))
    )
  }

  // Delete services that we could have currently in DB but that we did not receive for this current fetch
  const affectedUsers = await clearDeletedServices(existingServicesIds, token)
  stats.accountDeletions = affectedUsers.length

  // Delete users left with no accounts
  const deletedUsers = await deleteOrphanUsers(affectedUsers, token)
  stats.userDeletions = deletedUsers

  logger.info({ stats, enabledServices }, "finished sync")

  return stats
}

export default sync

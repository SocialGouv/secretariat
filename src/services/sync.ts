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
  deleteServicesNotIn,
  deleteUsers,
  getServicesMatchingId,
  insertService,
  insertUser,
  updateService,
  deleteService as deleteServiceQuery,
  getReviewedOnboardingRequestContaining,
  linkGithubOnboarding,
  enableUsersByServicesIds,
} from "../queries"

const DEFAULT_DELAY = 800

const servicesFetchers = {
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

export const getServiceFromData = async (
  serviceData: Record<string, unknown>,
  serviceName: ServiceName,
  token: string
): Promise<Record<string, any>[]> => {
  const idField = servicesIdFields[serviceName]
  const { services: servicesMatchingId } = await graphQLFetcher({
    query: getServicesMatchingId,
    token,
    parameters: {
      idKeyValue: { [idField]: serviceData[idField] },
      serviceName,
    },
  })
  return servicesMatchingId
}

export const upsertService = async (
  serviceData: Record<string, unknown>,
  serviceName: ServiceName,
  token: string
): Promise<{ serviceId: string; operationStats: SyncStats }> => {
  const operationStats: SyncStats = {
    errors: 0,
    updates: 0,
    insertions: 0,
    userDeletions: 0,
    accountDeletions: 0,
    enablements: 0,
  }
  const servicesMatchingId = await getServiceFromData(
    serviceData,
    serviceName,
    token
  )
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

    // Github accounts are created after the user accepted an invitation
    // At this moment, we need to check if the user comes from a Secrétariat onboarding or not
    // if so, link it to its onboarding request
    if (serviceName === "github") {
      const { onboarding_requests: onboardingRequests } = await graphQLFetcher({
        query: getReviewedOnboardingRequestContaining,
        parameters: { _contains: { githubLogin: serviceData.login } },
        token,
      })

      if (onboardingRequests.length === 1) {
        await graphQLFetcher({
          query: linkGithubOnboarding,
          token,
          parameters: {
            _contains: { login: serviceData.login },
            email: onboardingRequests[0].data.email,
            onboarding_request_id: onboardingRequests[0].id,
          },
        })
      }
    }

    operationStats.insertions += 1
    return { serviceId, operationStats }
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
    operationStats.updates += 1
    return { serviceId, operationStats }
  } else {
    logger.error(
      { servicesMatchingId },
      "Got multiple matches with a service's primary key field and service name"
    )
    operationStats.errors += 1
    return { serviceId: "", operationStats }
  }
}

const upsertServices = async (
  users: Record<string, unknown>[],
  serviceName: ServiceName,
  token: string,
  stats: SyncStats
): Promise<string[]> => {
  const existingServicesIds: string[] = []
  for (const userKey in users) {
    const { serviceId, operationStats } = await upsertService(
      users[userKey],
      serviceName,
      token
    )
    for (const key in operationStats) {
      if (key in stats) {
        stats[key as keyof SyncStats] += operationStats[key as keyof SyncStats]
      }
    }

    if (serviceId) {
      existingServicesIds.push(serviceId)
    }
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
      query: deleteServicesNotIn,
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

export const deleteService = async (
  serviceData: Record<string, unknown>,
  serviceName: ServiceName,
  token: string
) => {
  const servicesMatchingId = await getServiceFromData(
    serviceData,
    serviceName,
    token
  )
  if (servicesMatchingId.length === 0) {
    logger.error(
      { serviceName, serviceData },
      "Could not find service to delete"
    )
  } else if (servicesMatchingId.length === 1) {
    const {
      delete_services: { returning: affectedUsersForService },
    } = await graphQLFetcher({
      query: deleteServiceQuery,
      token,
      parameters: {
        serviceId: servicesMatchingId[0].id,
        serviceName,
      },
    })
    await deleteOrphanUsers(affectedUsersForService, token)
    logger.info(
      { serviceName, serviceData },
      "Successfully deleted user from Github webhook"
    )
  } else {
    logger.error(
      { serviceName, serviceData },
      "Got multiple matches for service to delete"
    )
  }
}

export const sync = async (enabledServices: ServiceName[]) => {
  logger.info({ enabledServices }, "started sync")

  const token = getJwt()

  const stats: SyncStats = {
    insertions: 0,
    updates: 0,
    errors: 0,
    userDeletions: 0,
    accountDeletions: 0,
    enablements: 0,
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
      ...(await upsertServices(
        dataByService[serviceName],
        serviceName,
        token,
        stats
      ))
    )
  }

  // Enable all users for which we received an account
  const flatIds = Object.values(existingServicesIds).reduce((acc, value) =>
    acc.concat(value)
  )
  if (flatIds.length > 0) {
    const result = await graphQLFetcher({
      query: enableUsersByServicesIds,
      token,
      parameters: {
        servicesIds: flatIds,
      },
    })
    stats.enablements += result.update_users.affected_rows
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

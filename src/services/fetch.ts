import { fetchGithubUsers } from "@/services/fetchers/github"
import { fetchMatomoUsers } from "@/services/fetchers/matomo"
import { fetchMattermostUsers } from "@/services/fetchers/mattermost"
import { fetchNextcloudUsers } from "@/services/fetchers/nextcloud"
import { fetchOvhUsers } from "@/services/fetchers/ovh"
import { fetchSentryUsers } from "@/services/fetchers/sentry"
import { fetchZammadUsers } from "@/services/fetchers/zammad"
import fetcher from "@/utils/fetcher"
import SERVICES from "@/utils/SERVICES"
import {
  deleteServices,
  deleteUsers,
  getServicesMatchingId,
  insertService,
  insertUser,
  updateService,
} from "../queries"

export const DEFAULT_DELAY = 800

const servicesFetchers: Record<ServiceName, any> = {
  github: fetchGithubUsers,
  matomo: fetchMatomoUsers,
  mattermost: fetchMattermostUsers,
  nextcloud: fetchNextcloudUsers,
  ovh: fetchOvhUsers,
  sentry: fetchSentryUsers,
  zammad: fetchZammadUsers,
}

const stats = { insertions: 0, updates: 0, error: 0 }
const servicesIdFields: Record<ServiceName, string> = {
  github: "id",
  matomo: "email", // This API does not return any unique ID in entries
  zammad: "id",
  sentry: "id",
  nextcloud: "id",
  mattermost: "id",
  ovh: "id",
}

const updateOrInsertService = async (
  serviceData: Record<string, unknown>,
  serviceName: ServiceName,
  jwt: string
): Promise<string> => {
  const idField = servicesIdFields[serviceName]
  const { services: servicesMatchingId } = await fetcher(
    getServicesMatchingId,
    jwt,
    {
      idKeyValue: { [idField]: serviceData[idField] },
      serviceName,
    }
  )
  if (servicesMatchingId.length === 0) {
    // This is a new service entry, we have to insert it into the table

    // First, create an associated user entry
    const {
      insert_users_one: { id: userId },
    } = await fetcher(insertUser, jwt)

    // Then, create the service entry
    const {
      insert_services_one: { id: serviceId },
    } = await fetcher(insertService, jwt, {
      service: { data: serviceData, user_id: userId, type: serviceName },
    })
    stats.insertions += 1
    return serviceId
  } else if (servicesMatchingId.length === 1) {
    // We have to update a service entry
    const {
      update_services_by_pk: { id: serviceId },
    } = await fetcher(updateService, jwt, {
      serviceId: servicesMatchingId[0].id,
      serviceData,
    })
    stats.updates += 1
    return serviceId
  } else {
    console.error(
      "Got multiple matches with a service's primary key field and service name",
      servicesMatchingId
    )
    stats.error += 1
    return ""
  }
}

const updateUsers = async (
  users: Record<string, unknown>[],
  serviceName: ServiceName,
  jwt: string
): Promise<string[]> => {
  const existingServicesIds: string[] = []
  // await Promise.all(
  //   users.map(async (user) => {
  //     existingServicesIds.push(
  //       await updateOrInsertService(user, serviceName, jwt)
  //     )
  //   })
  // )
  for (const userKey in users) {
    existingServicesIds.push(
      await updateOrInsertService(users[userKey], serviceName, jwt)
    )
  }
  return existingServicesIds
}

const clearDeletedServices = async (
  existingServicesIds: string[],
  jwt: string
) => {
  const {
    delete_services: { returning: affectedUsers },
  } = await fetcher(deleteServices, jwt, { existingServicesIds })
  console.log(
    `deleted ${affectedUsers.length} service ${
      affectedUsers.length > 1 ? "entries" : "entry"
    }`
  )
  return affectedUsers
}

const deleteOrphanUsers = async (
  affectedUsers: {
    users: {
      id: string
      services_aggregate: { aggregate: { count: number } }
    }
  }[],
  jwt: string
) => {
  fetcher(deleteUsers, jwt, {
    userIds: affectedUsers
      .filter((user) => user.users.services_aggregate.aggregate.count === 0)
      .map((user) => user.users.id),
  })
}

export const fetchAndUpdateServices = async (jwt: string) => {
  const existingServicesIds: string[] = []

  await Promise.all(
    SERVICES.map(async (serviceName) => {
      const users = await servicesFetchers[serviceName](DEFAULT_DELAY)
      existingServicesIds.push(...(await updateUsers(users, serviceName, jwt)))
      console.log(`fetched and updated ${serviceName} data`)
    })
  )

  console.log(
    `got ${existingServicesIds.length} existing services ids, clearing potentially deleted services from database`
  )
  const affectedUsers = await clearDeletedServices(existingServicesIds, jwt)
  await deleteOrphanUsers(affectedUsers, jwt)

  console.log("updated users table with all services data")
  console.log(stats)
  stats.error = 0
  stats.insertions = 0
  stats.updates = 0
}

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
  addUser,
  getServicesMatchingId,
  getServiceUsers,
  insertService,
  insertUser2,
  matchUserInServices,
  updateService,
  updateUser,
} from "../queries"
import { detectWarnings } from "../utils/detect-warnings"

export const DEFAULT_DELAY = 800

const servicesFetchers = {
  github: fetchGithubUsers,
  matomo: fetchMatomoUsers,
  mattermost: fetchMattermostUsers,
  nextcloud: fetchNextcloudUsers,
  ovh: fetchOvhUsers,
  sentry: fetchSentryUsers,
  zammad: fetchZammadUsers,
}

const emailFields: Record<string, string> = {
  github: "email",
  matomo: "email",
  zammad: "email",
  sentry: "email",
  nextcloud: "email",
  mattermost: "email",
  ovh: "primaryEmailAddress",
}

// checks if we can update an existing user entry (based on IDs or emails), inserts a new entry otherwise
// returns the affected entry for warning detection
const updateOrInsertUser = async (
  user: Record<string, unknown>,
  serviceName: string,
  jwt: string
) => {
  const email = user[emailFields[serviceName]]
  if (!email) {
    // if we don't have the email
    const { users: matchingIdUsers } = await fetcher(
      getServiceUsers(serviceName),
      jwt,
      {
        _contains: { id: user.id },
      }
    )
    if (matchingIdUsers.length === 0) {
      // if there's no row with this id for the given service, insert the user
      const newUserEntry = { [serviceName]: user }
      await fetcher(addUser, jwt, {
        user: {
          [serviceName]: user,
          warning: detectWarnings(newUserEntry as unknown as User),
        },
      })
    } else if (matchingIdUsers.length === 1) {
      // if there's one, update the user
      const newUserEntry = { ...matchingIdUsers[0], [serviceName]: user }
      await fetcher(updateUser, jwt, {
        id: matchingIdUsers[0].id,
        _set: { [serviceName]: user, warning: detectWarnings(newUserEntry) },
      })
    } else {
      // this is not supposed to happen
      console.error("More than one row had this id", matchingIdUsers)
    }
  } else {
    // if we have the email
    const { users: matchingEmailUsers } = await fetcher(
      matchUserInServices,
      jwt,
      {
        _or: SERVICES.map((service) => ({
          [service]: { _contains: { [emailFields[service]]: email } },
        })),
      }
    )
    if (matchingEmailUsers.length === 0) {
      // no row have the same email on any service, create the user
      const newUserEntry = { [serviceName]: user }
      await fetcher(addUser, jwt, {
        user: {
          [serviceName]: user,
          warning: detectWarnings(newUserEntry as unknown as User),
        },
      })
    } else if (matchingEmailUsers.length === 1) {
      // a row have the same email on a service, update the user
      const newUserEntry = { ...matchingEmailUsers[0], [serviceName]: user }
      await fetcher(updateUser, jwt, {
        id: matchingEmailUsers[0].id,
        _set: { [serviceName]: user, warning: detectWarnings(newUserEntry) },
      })
    } else {
      // this is not supposed to happen ?
      console.error("More than one row had this email")
    }
  }
}

const stats = { insertions: 0, updates: 0, error: 0 }
const servicesIdFields: Record<string, string> = {
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
  serviceName: string,
  jwt: string
) => {
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
      insert_users2_one: { id: userId },
    } = await fetcher(insertUser2, jwt)

    // Then, create the service entry
    await fetcher(insertService, jwt, {
      service: { data: serviceData, user_id: userId, type: serviceName },
    })
    stats.insertions += 1
  } else if (servicesMatchingId.length === 1) {
    // We have to update a service entry
    await fetcher(updateService, jwt, {
      serviceId: servicesMatchingId[0].id,
      serviceData,
    })
    stats.updates += 1
  } else {
    console.error(
      "Got multiple matches with a service's primary key field and service name",
      servicesMatchingId
    )
    stats.error += 1
  }
}

const updateUsers = async (
  users: Record<string, unknown>[],
  serviceName: string,
  jwt: string
) => {
  await Promise.all(
    users.map(async (user) => {
      // await updateOrInsertUser(user, serviceName, jwt)
      await updateOrInsertService(user, serviceName, jwt)
    })
  )
}

export const fetchAndUpdateServices = async (jwt: string) => {
  // store all fetched data to update users table sequentially afterwards
  const usersByService: Record<string, Record<string, unknown>[]> = {}
  await Promise.all(
    SERVICES.map(async (serviceName) => {
      const users = await servicesFetchers[serviceName](DEFAULT_DELAY)
      usersByService[serviceName] = users
      console.log(`fetched ${serviceName} data`)
    })
  )
  console.log("fetched all services data")

  for (const serviceName in usersByService) {
    // update users table for each service sequentially to detect possible merges
    await updateUsers(usersByService[serviceName], serviceName, jwt)
    console.log(`updated users table with ${serviceName} data`)
  }
  console.log("updated users table with all services data")
  console.log(stats)
  stats.error = 0
  stats.insertions = 0
  stats.updates = 0
}

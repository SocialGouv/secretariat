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
  getServiceUsers,
  matchUserInServices,
  updateServices,
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
        user: { [serviceName]: user, warning: detectWarnings(newUserEntry) },
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
        user: { [serviceName]: user, warning: detectWarnings(newUserEntry) },
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

const updateUsers = async (
  users: Record<string, unknown>[],
  serviceName: string,
  jwt: string
) => {
  await Promise.all(
    users.map(async (user) => {
      await updateOrInsertUser(user, serviceName, jwt)
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
      fetcher(updateServices(serviceName), jwt, { data: users })
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
}

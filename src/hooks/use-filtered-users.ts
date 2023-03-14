import useSWR from "swr"

import useUsers from "@/hooks/use-users"
import useSearch from "@/hooks/use-search"
import useFilters from "@/hooks/use-filters"

const useFilteredUsers = () => {
  const users = useUsers()
  const { query } = useSearch()
  const { filters } = useFilters()

  const matchSearchQuery = (user: User, regex: RegExp): boolean => {
    const { id: _id, ...data } = user
    const values = Object.values(data)
    return !!values
      .filter((value) => value && typeof value === "string")
      .concat(
        values
          .filter((value) => value && typeof value === "object")
          .reduce(
            (arr, obj) =>
              arr.concat(
                Object.values(obj).filter(
                  (value) => value && typeof value === "string"
                )
              ),
            [] as string[]
          )
      )
      .join(" ")
      .match(regex)
  }

  const matchServices = (user: User): boolean => {
    if (filters?.services) {
      for (const [key, value] of Object.entries(filters.services)) {
        if (value && user.services.find((service) => service.type === key)) {
          return true
        }
      }
    }
    return false
  }

  const matchAlerts = (user: User): boolean => {
    if (filters?.alerts) {
      return user.warnings.length > 0
    }
    return true
  }

  const matchExpiry = (user: User): boolean => {
    if (!filters?.expiry) {
      return true
    }
    if (user.departure) {
      return new Date(user.departure).getTime() < filters.expiry.getTime()
    }
    return false
  }

  const key = {
    users,
    filters,
    query,
  }

  const regex = new RegExp(query || "", "gi")

  const getData = () => {
    if (users) {
      return users.filter(
        (user: User) =>
          matchServices(user) &&
          matchSearchQuery(user, regex) &&
          matchAlerts(user) &&
          matchExpiry(user)
      )
    }
    return users
  }

  const { data } = useSWR(users && filters ? key : null, getData, {
    fallbackData: getData(),
  })

  return { users: data, query, filters }
}

export default useFilteredUsers

import SERVICES from "@/utils/SERVICES"

const containsMultipleServices = (user: User) => {
  const services = SERVICES.filter(
    (SERVICE) => !["github", "mattermost"].includes(SERVICE)
  )

  return user.services.length === 1 && services.includes(user.services[0].type)
    ? "alone_service"
    : null
}

const containsSpecificServices = (user: User) => {
  const MANDATORY_SERVICES: ServiceName[] = ["github", "mattermost"]

  return user.services.find(({ type }) =>
    MANDATORY_SERVICES.find((service) => service === type)
  )
    ? null
    : "missing_services"
}

const hasNoDepartureDate = (user: User) => {
  return !!user.departure ? null : "no_departure_date"
}

const ACTIVE_RULES = [
  hasNoDepartureDate,
  containsMultipleServices,
  containsSpecificServices,
]

export const detectWarnings = (user: User): Warning[] => {
  return ACTIVE_RULES.map((ruleFunction) => ruleFunction(user)).filter(
    (warning) => warning !== null
  ) as Warning[]
}

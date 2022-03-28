import SERVICES from "@/utils/SERVICES"

const containsMultipleServices = (userEntry: Record<string, unknown>) => {
  // Services that should not be alone in an entry
  const FORBIDDEN_ALONE_SERVICES: ServiceName[] = [
    "sentry",
    "zammad",
    "nextcloud",
    "matomo",
    "ovh",
  ]

  const services = Object.keys(userEntry).filter(
    (key) => (SERVICES as string[]).includes(key) && userEntry[key] !== null
  ) as ServiceName[]
  return services.length === 1 && FORBIDDEN_ALONE_SERVICES.includes(services[0])
    ? "alone_service"
    : null
}

const containsSpecificServices = (userEntry: Record<string, unknown>) => {
  // We want to find at least one these services in each entry
  const MANDATORY_SERVICES: ServiceName[] = ["github", "mattermost"]

  const services = Object.keys(userEntry).filter(
    (key) => (SERVICES as string[]).includes(key) && userEntry[key] !== null
  ) as ServiceName[]
  return services.some((element) => MANDATORY_SERVICES.includes(element))
    ? null
    : "missing_services"
}

const containsDepartureDate = (userEntry: Record<string, unknown>) => {
  // We want to find a departure date in each entry
  return userEntry.departure === null ? "missing_departure" : null
}

// Insert a rule function here to activate the rule
// The retained warning will be the first found
const ACTIVE_RULES = [
  containsMultipleServices,
  // containsDepartureDate,
  containsSpecificServices,
]

export const detectWarnings = (
  userEntry: Record<string, Record<string, unknown>>
) => {
  const warning = ACTIVE_RULES.map((ruleFunction) =>
    ruleFunction(userEntry)
  ).find((warning) => warning !== null)
  return warning ? warning : null
}

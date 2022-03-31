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

const ACTIVE_RULES = [containsMultipleServices, containsSpecificServices]

export const detectWarnings = (user: User) => {
  const warning = ACTIVE_RULES.map((ruleFunction) => ruleFunction(user)).find(
    (warning) => warning !== null
  )
  return warning ? warning : null
}

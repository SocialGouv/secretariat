import SERVICES from "@/utils/SERVICES"

// const containsMultipleServices = (userEntry: Record<string, unknown>) => {
//   // Services that should not be alone in an entry
//   const FORBIDDEN_ALONE_SERVICES: ServiceName[] = [
//     "sentry",
//     "zammad",
//     "nextcloud",
//     "matomo",
//     "ovh",
//   ]

//   const services = Object.keys(userEntry).filter(
//     (key) => (SERVICES as string[]).includes(key) && userEntry[key] !== null
//   ) as ServiceName[]
//   return services.length === 1 && FORBIDDEN_ALONE_SERVICES.includes(services[0])
//     ? "alone_service"
//     : null
// }

// const containsSpecificServices = (userEntry: Record<string, unknown>) => {
//   // We want to find at least one these services in each entry
//   const MANDATORY_SERVICES: ServiceName[] = ["github", "mattermost"]

//   const services = Object.keys(userEntry).filter(
//     (key) => (SERVICES as string[]).includes(key) && userEntry[key] !== null
//   ) as ServiceName[]
//   return services.some((element) => MANDATORY_SERVICES.includes(element))
//     ? null
//     : "missing_services"
// }

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

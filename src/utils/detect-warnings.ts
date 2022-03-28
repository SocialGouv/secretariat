const noAloneServices = (userEntry: Record<string, unknown>) => {
  const FORBIDDEN_ALONE_SERVICES: ServiceName[] = [
    "sentry",
    "zammad",
    "nextcloud",
    "matomo",
    "ovh",
  ]

  const services = Object.keys(userEntry).filter(
    (key) => key !== "id" && userEntry[key] !== null
  ) as ServiceName[]
  return services.length === 1 && FORBIDDEN_ALONE_SERVICES.includes(services[0])
    ? "alone_service"
    : null
}

// Insert a rule function here to active the rule
const ACTIVE_RULES = [noAloneServices]

export const detectWarnings = (
  userEntry: Record<string, Record<string, unknown>>
) => {
  const warning = ACTIVE_RULES.map((ruleFunction) =>
    ruleFunction(userEntry)
  ).find((warning) => warning !== null)
  return warning ? warning : null
}

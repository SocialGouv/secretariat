const noAloneServices = (userEntry: Record<string, unknown>) => {
  const FORBIDDEN_ALONE_SERVICES: ServiceName[] = [
    "sentry",
    "zammad",
    "nextcloud",
    "matomo",
    "ovh",
  ]
  const WARNING_LEVEL = 1

  const services = Object.keys(userEntry).filter(
    (key) => key !== "id" && userEntry[key] !== null
  ) as ServiceName[]
  return services.length === 1 && FORBIDDEN_ALONE_SERVICES.includes(services[0])
    ? WARNING_LEVEL
    : 0
}

// Insert a rule function here to active the rule
const ACTIVE_RULES = [noAloneServices]

export const detectWarnings = (
  userEntry: Record<string, Record<string, unknown>>
) => {
  return Math.max(
    ...ACTIVE_RULES.map((ruleFunction) => ruleFunction(userEntry))
  )
}

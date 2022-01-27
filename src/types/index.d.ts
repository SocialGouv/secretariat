interface GithubUser {
  id: string
  login: string
  email: string
  name: string
}

interface MatomoUser {
  login: string
  email: string
  superuser_access: string
  date_registered: date
  uses_2fa: boolean
}

interface SentryUser {
  id: string
  name: string
  email: string
}

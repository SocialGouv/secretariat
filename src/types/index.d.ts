interface GithubTeam {
  name: string
  slug: string
  avatarUrl: string
  description: string
}

interface GithubUser {
  id: string
  name: string
  login: string
  email: string
  avatarUrl: string
}

interface MatomoUser {
  login: string
  email: string
  uses_2fa: boolean
  date_registered: date
  superuser_access: string
}

interface SentryUser {
  id: string
  name: string
  email: string
}

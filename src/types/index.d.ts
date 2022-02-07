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

interface NextCloudUser {
  login: string
}

interface OVHUser {
  email: string
}

interface ZammadUser {
  email: string
}

interface MattermostUser {
  email: string
}

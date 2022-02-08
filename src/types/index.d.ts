interface GithubTeam {
  id: string
  name: string
  slug: string
}

interface GithubUser {
  id: string
  name: string
  login: string
  email: string
  avatarUrl: string
  teams: GithubTeam[]
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
  role: string
  dateCreated: Date
  user: {
    avatarUrl: string
  }
}

interface NextCloudUser {
  id: string
  email: string
  lastLogin: string
  displayname: string
}

interface OVHUser {
  id: string
  login: string
  lastName: string
  firstName: string
  creationDate: Date
  displayName: string
  primaryEmailAddress: string
}

interface ZammadUser {
  email: string
  login: string
  created_at: Date
  lastname: string
  firstname: string
}

interface MattermostUser {
  id: string
  email: string
  create_at: Date
  username: string
  last_name: string
  first_name: string
}

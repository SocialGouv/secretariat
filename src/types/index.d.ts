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
  role: string
  dateCreated: Date
  user: {
    avatarUrl: string
  }
}

interface NextCloudUser {
  id: string
  email: string
  displayname: string
}

interface OVHUser {
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
  lastname: string
  firstname: string
}

interface MattermostUser {
  email: string
  username: string
  last_name: string
  first_name: string
}

interface BasicUser {
  id?: string
  login?: string
  avatarUrl?: string
  teams?: GithubTeam[]
  github?: GithubUser
  matomo?: MatomoUser
  mattermost?: MattermostUser
  nextcloud?: NextCloudUser
  ovh?: OVHUser
  sentry?: SentryUser
  zammad?: ZammadUser
}

interface UserWithName extends BasicUser {
  email?: string
  name: string
}

interface UserWithEmail extends BasicUser {
  email: string
  name?: string
}

type User = UserWithEmail | UserWithName

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
  id: string
  login: string
  email: string
  uses_2fa: boolean
  date_registered: date
}

interface SentryUser {
  id: string
  name: string
  email: string
  dateCreated: Date
  user: {
    has2fa: boolean
    avatarUrl: string
  }
}

interface NextCloudUser {
  id: string
  email?: string
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
  id: string
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

type MixedUser =
  | User
  | GithubUser
  | MatomoUser
  | SentryUser
  | NextCloudUser
  | OVHUser
  | MattermostUser
  | ZammadUser

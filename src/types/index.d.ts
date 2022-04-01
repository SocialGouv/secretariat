interface User {
  id: string
  name: string
  email: string
  arrival?: Date
  departure?: Date
  updated_at: Date
  avatarUrl: string
  services: ServiceAccount[]
  warning?: "alone_service" | "missing_services" | null
}

interface GithubTeam {
  id: string
  name: string
  slug: string
}

interface BasicServiceAccount {
  id: string
  type: ServiceName
}

interface GithubServiceAccount extends BasicServiceAccount {
  type: "github"
  data: {
    name: string
    login: string
    email: string
    avatarUrl: string
    teams: GithubTeam[]
  }
}

interface MatomoServiceAccount extends BasicServiceAccount {
  type: "matomo"
  data: {
    login: string
    email: string
    uses_2fa: boolean
    date_registered: date
  }
}

interface SentryServiceAccount extends BasicServiceAccount {
  type: "sentry"
  data: {
    name: string
    email: string
    dateCreated: Date
    projects: string[]
    flags: Record<string, boolean>
    user: {
      has2fa: boolean
      avatarUrl: string
    }
  }
}

interface NextCloudServiceAccount extends BasicServiceAccount {
  type: "nextcloud"
  data: {
    id: string
    email: string
    lastLogin: string
    displayname: string
  }
}

interface OVHServiceAccount extends BasicServiceAccount {
  type: "ovh"
  data: {
    id: string
    login: string
    lastName: string
    firstName: string
    creationDate: Date
    displayName: string
    primaryEmailAddress: string
  }
}

interface ZammadServiceAccount extends BasicServiceAccount {
  type: "zammad"
  data: {
    id: string
    email: string
    login: string
    created_at: Date
    lastname: string
    firstname: string
  }
}

interface MattermostServiceAccount extends BasicServiceAccount {
  type: "mattermost"
  data: {
    id: string
    email: string
    create_at: Date
    username: string
    last_name: string
    first_name: string
  }
}

interface ServiceAccountsMapping {
  github: GithubServiceAccount
  matomo: MatomoServiceAccount
  sentry: SentryServiceAccount
  nextcloud: NextCloudServiceAccount
  ovh: OVHServiceAccount
  zammad: ZammadServiceAccount
  mattermost: MattermostServiceAccount
}

type ServiceName = keyof ServiceAccountsMapping
type ServiceAccount = ServiceAccountsMapping[ServiceName]

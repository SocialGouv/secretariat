interface User {
  id: string
  name: string
  email: string
  arrival?: string
  departure?: string
  updated_at: string
  avatarUrl: string
  services: ServiceAccount[]
  warnings: Warning[]
}

type Warning = "alone_service" | "missing_services" | "no_departure_date"

interface GithubTeam {
  id: string
  name: string
  slug: string
}

interface MattermostTeam {
  name: string
}

interface MatomoSite {
  name: string
}

interface ZammadGroup {
  name: string
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
    sites: MatomoSite[]
  }
}

interface SentryServiceAccount extends BasicServiceAccount {
  type: "sentry"
  data: {
    id: string
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
    groups: string[]
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
    groups: ZammadGroup[]
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
    teams: MattermostTeam[]
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

type AccountRevoker = (
  accountServiceID: string,
  accountID: string
) => Promise<APIResponse>

interface APIResponse {
  status: number
  body: string
}

type ServiceName = keyof ServiceAccountsMapping
type ServiceAccount = ServiceAccountsMapping[ServiceName]

interface OnboardingData {
  email: string
  departure: string
  message: string
  lastName: string
  firstName: string
  arrival: string
  githubLogin: string
  services: Record<ServiceName, boolean>
}

interface OnboardingResponses {
  github?: APIResponse
  mattermost?: APIResponse
  ovh?: APIResponse & { mailInfo: { login: string; password: string } }
}

interface OnboardingRequest {
  id: string
  created_at: Date
  reviewed: { author: string; date: string } | null
  confirmed: boolean
  data: OnboardingData
}

interface OnboardingRequestServices {
  github?: boolean
  matomo?: boolean
  sentry?: boolean
  nextcloud?: boolean
  ovh?: boolean
  zammad?: boolean
  mattermost?: boolean
}

interface Logs {
  id: string
  created_at: date
  user: string
  action: string
  parameters: string
}

interface syncStats {
  insertions: number
  updates: number
  errors: number
  userDeletions: number
  accountDeletions: number
}

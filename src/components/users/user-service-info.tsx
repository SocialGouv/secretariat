import ServiceLogo from "@/components/common/service-logo"
import { insertUser, updateService } from "@/queries/index"
import useToken from "@/hooks/use-token"
import fetcher from "@/utils/fetcher"

const InfoTable = ({
  data,
}: {
  data: Record<string, string | boolean | Date>
}) => (
  <div className="info-table grid grid-flow-row grid-cols-3">
    {Object.entries(data).map(([key, value], i) => (
      <div key={i} className="contents">
        <div>{key}</div>
        <div className="col-span-2">{value}</div>
      </div>
    ))}
  </div>
)

const GithubUserInfo = ({
  account: {
    data: { avatarUrl, teams, ...info },
  },
}: {
  account: GithubServiceAccount
}) => (
  <>
    <InfoTable data={info as never} />
    <div className="teams">
      {teams?.map((team, i) => (
        <div key={i} className="tag">
          {team.name}
        </div>
      ))}
    </div>
  </>
)

const SentryUserInfo = ({
  account: {
    data: { user, projects, flags, ...info },
  },
}: {
  account: SentryServiceAccount
}) => <InfoTable data={{ ...info, uses_2fa: user.has2fa }} />

const MattermostUserInfo = ({
  account: {
    data: { id, first_name, last_name, email, create_at, username },
  },
}: {
  account: MattermostServiceAccount
}) => (
  <InfoTable data={{ username, first_name, last_name, email, id, create_at }} />
)

const OVHUserInfo = ({
  account: {
    data: {
      id,
      login,
      lastName,
      firstName,
      creationDate,
      displayName,
      primaryEmailAddress,
    },
  },
}: {
  account: OVHServiceAccount
}) => (
  <InfoTable
    data={{
      id,
      login,
      lastName,
      firstName,
      creationDate,
      displayName,
      primaryEmailAddress,
    }}
  />
)

const NextCloudUserInfo = ({
  account: {
    data: { id, email, lastLogin, displayname },
  },
}: {
  account: NextCloudServiceAccount
}) => <InfoTable data={{ id, email, lastLogin, displayname }} />

const ZammadUserInfo = ({
  account: {
    data: { id, email, login, created_at, lastname, firstname },
  },
}: {
  account: ZammadServiceAccount
}) => <InfoTable data={{ id, email, login, created_at, lastname, firstname }} />

const UserServiceInfo = ({
  account,
  isSingleAccount,
  onDetachAccount,
}: {
  account: ServiceAccount
  isSingleAccount: boolean
  onDetachAccount: (account: ServiceAccount) => void
}) => {
  const [token] = useToken()

  const handleUnmergeButton = async (account: ServiceAccount) => {
    if (isSingleAccount) {
      return
    }

    // Create a new user for the unmerged account
    const {
      insert_users_one: { id: userId },
    } = await fetcher(insertUser, token)

    // Change the account's foreign key
    await fetcher(updateService, token, {
      serviceId: account.id,
      service: { user_id: userId },
    })

    // Refresh selected user and users list
    onDetachAccount(account)
  }

  return (
    <div className="service">
      <h3>
        <div className="leftContainer">
          <div className="icon">
            <ServiceLogo name={account.type} />
          </div>
          <div className="title">{account.type}</div>
        </div>
        {!isSingleAccount && (
          <button
            className="secondary"
            onClick={(_) => handleUnmergeButton(account)}
          >
            Détacher
          </button>
        )}
      </h3>
      {account.type === "github" && <GithubUserInfo account={account} />}
      {account.type === "matomo" && <InfoTable data={account.data} />}
      {account.type === "sentry" && <SentryUserInfo account={account} />}
      {account.type === "mattermost" && (
        <MattermostUserInfo account={account} />
      )}
      {account.type === "ovh" && <OVHUserInfo account={account} />}
      {account.type === "nextcloud" && <NextCloudUserInfo account={account} />}
      {account.type === "zammad" && <ZammadUserInfo account={account} />}
    </div>
  )
}

export default UserServiceInfo

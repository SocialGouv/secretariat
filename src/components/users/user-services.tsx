import SERVICES from "@/utils/SERVICES"
import ServiceLogo from "@/components/common/service-logo"

const InfoTable = ({ user }: { user: MixedUser }) => (
  <div className="info-table grid grid-flow-row grid-cols-3">
    {Object.entries(user).map(([key, value], i) => (
      <div key={i} className="contents">
        <div>{key}</div>
        <div className="col-span-2">{value}</div>
      </div>
    ))}
  </div>
)

const GithubUserInfo = ({
  user: { avatarUrl, teams, ...info },
}: {
  user: GithubUser
}) => (
  <>
    <InfoTable user={info} />
    <div className="mt-4">
      {teams?.map((team, i) => (
        <div key={i} className="tag">
          {team.name}
        </div>
      ))}
    </div>
  </>
)

const SentryUserInfo = ({
  user: { user, projects, flags, ...info },
}: {
  user: SentryUser
}) => <InfoTable user={{ ...info, uses_2fa: user.has2fa }} />

const MattermostUserInfo = ({
  user: { first_name, last_name, email, id, create_at, username },
}: {
  user: MattermostUser
}) => (
  <InfoTable user={{ username, first_name, last_name, email, id, create_at }} />
)

const OVHUserInfo = ({
  user: {
    id,
    login,
    lastName,
    firstName,
    creationDate,
    displayName,
    primaryEmailAddress,
  },
}: {
  user: OVHUser
}) => (
  <InfoTable
    user={{
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
  user: { id, email, lastLogin, displayname },
}: {
  user: NextCloudUser
}) => <InfoTable user={{ id, email, lastLogin, displayname }} />

const ZammadUserInfo = ({
  user: { id, email, login, created_at, lastname, firstname },
}: {
  user: ZammadUser
}) => <InfoTable user={{ id, email, login, created_at, lastname, firstname }} />

const ServiceInfo = ({
  user,
  service,
}: {
  user: User
  service: ServiceName
}) => (
  <div className="service">
    <h3>
      <div className="icon">
        <ServiceLogo service={service} />
      </div>
      <div className="title">{service}</div>
    </h3>
    {service === "github" && user.github && (
      <GithubUserInfo user={user.github} />
    )}
    {service === "matomo" && user.matomo && <InfoTable user={user.matomo} />}
    {service === "sentry" && user.sentry && (
      <SentryUserInfo user={user.sentry} />
    )}
    {service === "mattermost" && user.mattermost && (
      <MattermostUserInfo user={user.mattermost} />
    )}
    {service === "ovh" && user.ovh && <OVHUserInfo user={user.ovh} />}
    {service === "nextcloud" && user.nextcloud && (
      <NextCloudUserInfo user={user.nextcloud} />
    )}
    {service === "zammad" && user.zammad && (
      <ZammadUserInfo user={user.zammad} />
    )}
  </div>
)

const UserServices = ({ user }: { user: User }) => (
  <div className="services">
    {SERVICES.reduce(
      (services, service, i) => (
        user[service] &&
          services.push(<ServiceInfo key={i} service={service} user={user} />),
        services
      ),
      [] as JSX.Element[]
    )}
  </div>
)

export default UserServices

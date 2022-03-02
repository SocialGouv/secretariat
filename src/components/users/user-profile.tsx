import Image from "next/image"
import { useDrop } from "react-dnd"

import OVHLogo from "@/components/common/logo/ovh"
import GithubLogo from "@/components/common/logo/github"
import SentryLogo from "@/components/common/logo/sentry"
import MatomoLogo from "@/components/common/logo/matomo"
import ZammadLogo from "@/components/common/logo/zammad"
import NextCloudLogo from "@/components/common/logo/nextcloud"
import MattermostLogo from "@/components/common/logo/mattermost"
import { haveSimilarServices } from "@/services/users"

const ServiceHeader = ({
  title,
  children,
}: {
  title: string
  children: JSX.Element
}) => (
  <h3>
    <div className="icon">{children}</div>
    <div className="title">{title}</div>
  </h3>
)

const InfoTable = ({ user }: { user: MixedUser }) => (
  <table>
    <tbody>
      {Object.entries(user).map(([key, value], i) => (
        <tr key={i}>
          <td>{key}</td>
          <td>{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

const GithubUserInfo = ({
  user: { avatarUrl, teams, ...info },
}: {
  user: GithubUser
}) => (
  <div className="service">
    <ServiceHeader title="Github">
      <GithubLogo />
    </ServiceHeader>
    <hr className="my-2" />
    <InfoTable user={info} />
    <div className="mt-4">
      {teams?.map((team, i) => (
        <div key={i} className="tag">
          {team.name}
        </div>
      ))}
    </div>
  </div>
)

const MatomoUserInfo = ({ user }: { user: MatomoUser }) => (
  <div className="service">
    <ServiceHeader title="Matomo">
      <MatomoLogo />
    </ServiceHeader>
    <hr className="my-2" />
    <InfoTable user={user} />
  </div>
)

const SentryUserInfo = ({
  user: { user, projects, flags, ...info },
}: {
  user: SentryUser
}) => (
  <div className="service">
    <ServiceHeader title="Sentry">
      <SentryLogo />
    </ServiceHeader>
    <hr className="my-2" />
    <InfoTable user={{ ...info, uses_2fa: user.has2fa }} />
  </div>
)

const MattermostUserInfo = ({
  user: { first_name, last_name, email, id, create_at, username },
}: {
  user: MattermostUser
}) => (
  <div className="service">
    <ServiceHeader title="Mattermost">
      <MattermostLogo />
    </ServiceHeader>
    <hr className="my-2" />
    <InfoTable
      user={{ username, first_name, last_name, email, id, create_at }}
    />
  </div>
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
  <div className="service">
    <ServiceHeader title="OVH">
      <OVHLogo />
    </ServiceHeader>
    <hr className="my-2" />
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
  </div>
)

const NextCloudUserInfo = ({
  user: { id, email, lastLogin, displayname },
}: {
  user: NextCloudUser
}) => (
  <div className="service">
    <ServiceHeader title="NextCloud">
      <NextCloudLogo />
    </ServiceHeader>
    <hr className="my-2" />
    <InfoTable user={{ id, email, lastLogin, displayname }} />
  </div>
)

const ZammadUserInfo = ({
  user: { id, email, login, created_at, lastname, firstname },
}: {
  user: ZammadUser
}) => (
  <div className="service">
    <ServiceHeader title="Pastek">
      <ZammadLogo />
    </ServiceHeader>
    <hr className="my-2" />
    <InfoTable user={{ id, email, login, created_at, lastname, firstname }} />
  </div>
)

const UserProfile = ({
  user,
  onUserDrop,
}: {
  user: User
  onUserDrop: (user: User) => User
}) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "user",
      drop: onUserDrop,
      canDrop: (item) => !haveSimilarServices(item, user),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [user]
  )

  const backgroundColor = canDrop
    ? isOver
      ? "#e8edff"
      : "#f4f6ff"
    : "transparent"

  return (
    <div className="selected-user">
      <div className="sticky-container">
        <div
          ref={drop}
          role={"Profile"}
          className="user-profile"
          style={{ backgroundColor }}
        >
          <div className="header">
            <Image
              width={48}
              height={48}
              alt="user avatar"
              src={user.avatarUrl || "/images/avatar.jpeg"}
            />
            <h2>{user.name}</h2>
          </div>
          <div className="services">
            {user.github ? <GithubUserInfo user={user.github} /> : <></>}
            {user.mattermost ? (
              <MattermostUserInfo user={user.mattermost} />
            ) : (
              <></>
            )}
            {user.matomo ? <MatomoUserInfo user={user.matomo} /> : <></>}
            {user.sentry ? <SentryUserInfo user={user.sentry} /> : <></>}
            {user.ovh ? <OVHUserInfo user={user.ovh} /> : <></>}
            {user.nextcloud ? (
              <NextCloudUserInfo user={user.nextcloud} />
            ) : (
              <></>
            )}
            {user.zammad ? <ZammadUserInfo user={user.zammad} /> : <></>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile

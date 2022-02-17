import Image from "next/image"
import { useEffect, useState } from "react"

import useUsers from "@/services/users"
import UsersTemplate from "@/components/users/index"
import UserListTemplate from "@/components/users/user-list"
import UserProfileTemplate from "@/components/users/user-profile"
import SentryLogo from "./common/logo/sentry"
import MattermostLogo from "./common/logo/mattermost"
import GithubLogo from "./common/logo/github"
import OVHLogo from "./common/logo/ovh"

const GithubUserInfo = ({ user }: { user: GithubUser }) => (
  <>
    <h3>
      <div className="icon">
        <GithubLogo />
      </div>
      <div className="title">Github</div>
    </h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
      <li>
        <br />
        {user.teams?.map((team, i) => (
          <div key={i} className="tag">
            {team.name}
          </div>
        ))}
      </li>
    </ul>
  </>
)

const MatomoUserInfo = ({ user }: { user: MatomoUser }) => (
  <>
    <h3>Matomo</h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
      <li>
        <strong>Date de création</strong>: {user.date_registered}
      </li>
      <li>
        <strong>2FA acitvé</strong>: {user.uses_2fa ? "oui" : "non"}
      </li>
    </ul>
  </>
)

const SentryUserInfo = ({ user }: { user: SentryUser }) => (
  <>
    <h3>
      <div className="icon">
        <SentryLogo />
      </div>
      <div className="title">Sentry</div>
    </h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Nom</strong>: {user.name}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
      <li>
        <strong>Date de création</strong>: {user.dateCreated}
      </li>
      <li>
        <strong>2FA activé</strong>: {user.user.has2fa ? "oui" : "non"}
      </li>
    </ul>
  </>
)

const MattermostUserInfo = ({ user }: { user: MattermostUser }) => (
  <>
    <h3>
      <div className="icon">
        <MattermostLogo />
      </div>
      <div className="title">Mattermost</div>
    </h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Nom</strong>:{" "}
        {user.first_name
          ? `${user.first_name} ${user.last_name}`
          : user.username}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
      <li>
        <strong>Date de création</strong>: {user.create_at}
      </li>
    </ul>
  </>
)

const OVHUserInfo = ({ user }: { user: OVHUser }) => (
  <>
    <h3>
      <div className="icon">
        <OVHLogo />
      </div>
      <div className="title">OVH</div>
    </h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Nom</strong>:{" "}
        {user.firstName
          ? `${user.firstName} ${user.lastName}`
          : user.displayName}{" "}
      </li>
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.primaryEmailAddress}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
      <li>
        <strong>Date de création</strong>: {user.creationDate}
      </li>
    </ul>
  </>
)

const NextCloudUserInfo = ({ user }: { user: NextCloudUser }) => (
  <>
    <h3>NextCloud</h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Nom</strong>: {user.displayname}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
      <li>
        <strong>Dernière connexion</strong>: {user.lastLogin}
      </li>
    </ul>
  </>
)

const ZammadUserInfo = ({ user }: { user: ZammadUser }) => (
  <>
    <h3>Pastek</h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Nom</strong>: {user.firstname} {user.lastname}
      </li>
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>Date de création</strong>: {user.created_at}
      </li>
    </ul>
  </>
)

const UserProfile = ({ user }: { user: User }) => (
  <UserProfileTemplate>
    <div className="flex items-center mb-4">
      <Image
        width={48}
        height={48}
        alt="user avatar"
        src={user.avatarUrl || "/images/avatar.jpeg"}
      />
      <h2 className="ml-4">{user.name}</h2>
    </div>
    {user.github ? <GithubUserInfo user={user.github} /> : <></>}
    {user.matomo ? <MatomoUserInfo user={user.matomo} /> : <></>}
    {user.mattermost ? <MattermostUserInfo user={user.mattermost} /> : <></>}
    {user.sentry ? <SentryUserInfo user={user.sentry} /> : <></>}
    {user.ovh ? <OVHUserInfo user={user.ovh} /> : <></>}
    {user.nextcloud ? <NextCloudUserInfo user={user.nextcloud} /> : <></>}
    {user.zammad ? <ZammadUserInfo user={user.zammad} /> : <></>}
  </UserProfileTemplate>
)

const Users = () => {
  const users = useUsers()
  const [selectedUser, setSelectedUser] = useState<User>()

  useEffect(() => {
    if (users && users.length) {
      setSelectedUser(users[0])
    }
  }, [users])

  return (
    <UsersTemplate users={users}>
      <>
        <UserListTemplate
          users={users}
          selectedUser={selectedUser}
          getUserData={(user) => {
            const { mattermost, sentry } = user as User
            if (mattermost) {
              const { username, first_name, last_name, email } = mattermost
              return {
                email,
                login: username,
                name: first_name && `${first_name} ${last_name}`,
                ...user,
              } as User
            } else if (sentry) {
              const {
                name,
                email,
                user: { avatarUrl },
              } = sentry
              return {
                email,
                name,
                avatarUrl,
                ...user,
              } as User
            }
            return user as User
          }}
          onSelect={(user) => setSelectedUser(user as User)}
        />
        {selectedUser && <UserProfile user={selectedUser} />}
      </>
    </UsersTemplate>
  )
}

export default Users

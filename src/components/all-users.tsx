import Image from "next/image"
import { useEffect, useState } from "react"

import useUsers from "@/services/users"
import UsersTemplate from "@/components/users/index"
import UserListTemplate from "@/components/users/user-list"
import UserProfileTemplate from "@/components/users/user-profile"

const UserProfile = ({ user }: { user: MixedUser }) => (
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
    {user.github && (
      <>
        <h3>Github</h3>
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
    )}
    {user.matomo && (
      <>
        <h3>Matomo</h3>
        <hr className="my-2" />
        <ul className="text-sm">
          <li>
            <strong>Login</strong>: {user.matomo.login}
          </li>
          <li>
            <strong>Email</strong>: {user.matomo.email}
          </li>
          <li>
            <strong>ID</strong>: {user.matomo.id}
          </li>
          <li>
            <strong>Date de création</strong>: {user.matomo.date_registered}
          </li>
          <li>
            <strong>2FA acitvé</strong>: {user.matomo.uses_2fa ? "oui" : "non"}
          </li>
        </ul>
      </>
    )}
    {user.mattermost && (
      <>
        <h3>Mattermost</h3>
        <hr className="my-2" />
        <ul className="text-sm">
          <li>
            <strong>Nom</strong>:{" "}
            {user.mattermost.first_name
              ? `${user.mattermost.first_name} ${user.mattermost.last_name}`
              : user.mattermost.username}
          </li>
          <li>
            <strong>Email</strong>: {user.mattermost.email}
          </li>
          <li>
            <strong>ID</strong>: {user.mattermost.id}
          </li>
          <li>
            <strong>Date de création</strong>: {user.mattermost.create_at}
          </li>
        </ul>
      </>
    )}
    {user.sentry && (
      <>
        <h3>Sentry</h3>
        <hr className="my-2" />
        <ul className="text-sm">
          <li>
            <strong>Nom</strong>: {user.sentry.name}
          </li>
          <li>
            <strong>Email</strong>: {user.sentry.email}
          </li>
          <li>
            <strong>ID</strong>: {user.sentry.id}
          </li>
          <li>
            <strong>Date de création</strong>: {user.sentry.dateCreated}
          </li>
          <li>
            <strong>2FA activé</strong>:{" "}
            {user.sentry.user.has2fa ? "oui" : "non"}
          </li>
        </ul>
      </>
    )}
    {user.ovh && (
      <>
        <h3>OVH</h3>
        <hr className="my-2" />
        <ul className="text-sm">
          <li>
            <strong>Nom</strong>:{" "}
            {user.ovh.firstName
              ? `${user.ovh.firstName} ${user.ovh.lastName}`
              : user.ovh.displayName}{" "}
          </li>
          <li>
            <strong>Login</strong>: {user.ovh.login}
          </li>
          <li>
            <strong>Email</strong>: {user.ovh.primaryEmailAddress}
          </li>
          <li>
            <strong>ID</strong>: {user.ovh.id}
          </li>
          <li>
            <strong>Date de création</strong>: {user.ovh.creationDate}
          </li>
        </ul>
      </>
    )}
    {user.nextcloud && (
      <>
        <h3>NextCloud</h3>
        <hr className="my-2" />
        <ul className="text-sm">
          <li>
            <strong>Nom</strong>: {user.nextcloud.displayname}
          </li>
          <li>
            <strong>Email</strong>: {user.nextcloud.email}
          </li>
          <li>
            <strong>ID</strong>: {user.nextcloud.id}
          </li>
          <li>
            <strong>Dernière connexion</strong>: {user.nextcloud.lastLogin}
          </li>
        </ul>
      </>
    )}
    {user.zammad && (
      <>
        <h3>Pastek</h3>
        <hr className="my-2" />
        <ul className="text-sm">
          <li>
            <strong>Nom</strong>: {user.zammad.firstname} {user.zammad.lastname}
          </li>
          <li>
            <strong>Login</strong>: {user.zammad.login}
          </li>
          <li>
            <strong>Email</strong>: {user.zammad.email}
          </li>
          <li>
            <strong>Date de création</strong>: {user.zammad.created_at}
          </li>
        </ul>
      </>
    )}
  </UserProfileTemplate>
)

const Users = () => {
  const users = useUsers()
  const [selectedUser, setSelectedUser] = useState<MixedUser>()

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
          getUserData={(user) => user as MixedUser}
          onSelect={(user) => setSelectedUser(user as MixedUser)}
        />
        {selectedUser && <UserProfile user={selectedUser} />}
      </>
    </UsersTemplate>
  )
}

export default Users

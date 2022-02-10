import { useState } from "react"

import useSentryUsers from "@/services/sentry"
import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const SentryUsers = () => {
  const users = useSentryUsers()
  const [selectedUser, setSelectedUser] = useState<SentryUser>()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return (
    <div className="github-users">
      <UserList
        users={users}
        selectedUser={selectedUser}
        getUserData={(user) => {
          const {
            user: { avatarUrl },
          } = user as SentryUser
          return { avatarUrl, ...user } as User
        }}
        onSelect={(user) => setSelectedUser(user as SentryUser)}
      />
      {selectedUser && (
        <UserProfile>
          <div>Nom: {selectedUser.name}</div>
          <div>Email: {selectedUser.email}</div>
          <div>ID: {selectedUser.id}</div>
          <div>Date de création: {selectedUser.dateCreated}</div>
          <div>2FA activé: {selectedUser.user.has2fa ? "oui" : "non"}</div>
        </UserProfile>
      )}
    </div>
  )
}

export default SentryUsers

import { useState } from "react"

import Users from "@/components/users/index"
import useSentryUsers from "@/services/sentry"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const SentryUsers = () => {
  const users = useSentryUsers()
  const [selectedUser, setSelectedUser] = useState<SentryUser>()

  return (
    <Users users={users}>
      <>
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
      </>
    </Users>
  )
}

export default SentryUsers

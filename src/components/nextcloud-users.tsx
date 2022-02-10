import { useState } from "react"

import useNextCloudUsers from "@/services/nextcloud"
import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const NextCloudUsers = () => {
  const users = useNextCloudUsers()
  const [selectedUser, setSelectedUser] = useState<NextCloudUser>()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return (
    <div className="github-users">
      <UserList
        users={users}
        selectedUser={selectedUser}
        getUserData={(user) => {
          const { displayname: name, email } = user as NextCloudUser
          return { email, name }
        }}
        onSelect={(user) => setSelectedUser(user as NextCloudUser)}
      />
      {selectedUser && (
        <UserProfile>
          <div>Nom: {selectedUser.displayname}</div>
          <div>Email: {selectedUser.email}</div>
          <div>ID: {selectedUser.id}</div>
          <div>Dernière connexion: {selectedUser.lastLogin}</div>
        </UserProfile>
      )}
    </div>
  )
}

export default NextCloudUsers

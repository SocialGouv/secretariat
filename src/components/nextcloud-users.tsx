import { useEffect, useState } from "react"

import Users from "@/components/users/index"
import UserList from "@/components/users/user-list"
import useNextCloudUsers from "@/services/nextcloud"
import UserProfile from "@/components/users/user-profile"

const NextCloudUsers = () => {
  const users = useNextCloudUsers()
  const [selectedUser, setSelectedUser] = useState<NextCloudUser>()

  useEffect(() => {
    if (users && users.length) {
      setSelectedUser(users[0])
    }
  }, [users])

  return (
    <Users users={users}>
      <>
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
      </>
    </Users>
  )
}

export default NextCloudUsers

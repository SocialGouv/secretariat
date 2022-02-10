import { useState } from "react"

import useZammadUsers from "@/services/zammad"
import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const ZammadUsers = () => {
  const users = useZammadUsers()
  const [selectedUser, setSelectedUser] = useState<ZammadUser>()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return (
    <div className="github-users">
      <UserList
        users={users}
        selectedUser={selectedUser}
        getUserData={(user) => {
          const { firstname, lastname, email } = user as ZammadUser
          return {
            email,
            name: firstname && `${firstname} ${lastname}`,
          }
        }}
        onSelect={(user) => setSelectedUser(user as ZammadUser)}
      />
      {selectedUser && (
        <UserProfile>
          <div>
            Nom: {selectedUser.firstname} {selectedUser.lastname}
          </div>
          <div>Login: {selectedUser.login}</div>
          <div>Email: {selectedUser.email}</div>
          <div>Date de création: {selectedUser.created_at}</div>
        </UserProfile>
      )}
    </div>
  )
}

export default ZammadUsers

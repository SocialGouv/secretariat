import { useState } from "react"

import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import useMattermostUsers from "@/services/mattermost"
import UserProfile from "@/components/users/user-profile"

const MattermostUsers = () => {
  const users = useMattermostUsers()
  const [selectedUser, setSelectedUser] = useState<MattermostUser>()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return (
    <div className="github-users">
      <UserList
        users={users}
        selectedUser={selectedUser}
        getUserData={(user) => {
          const { username, first_name, last_name, email } =
            user as MattermostUser
          return {
            email,
            login: username,
            name: first_name && `${first_name} ${last_name}`,
          }
        }}
        onSelect={(user) => setSelectedUser(user as MattermostUser)}
      />
      {selectedUser && (
        <UserProfile>
          <div>
            Nom:{" "}
            {selectedUser.first_name
              ? `${selectedUser.first_name} ${selectedUser.last_name}`
              : selectedUser.username}
          </div>
          <div>Email: {selectedUser.email}</div>
          <div>ID: {selectedUser.id}</div>
          <div>Date de création: {selectedUser.create_at}</div>
        </UserProfile>
      )}
    </div>
  )
}

export default MattermostUsers

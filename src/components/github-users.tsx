import { useState } from "react"

import useGithubUsers from "@/services/github"
import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const GithubUsers = () => {
  const users = useGithubUsers()
  const [selectedUser, setSelectedUser] = useState<GithubUser>()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return (
    <div className="github-users">
      <UserList
        users={users}
        onSelect={setSelectedUser}
        selectedUser={selectedUser}
      />
      {selectedUser && (
        <UserProfile>
          <div>Nom: {selectedUser.name}</div>
          <div>Login: {selectedUser.login}</div>
          <div>Email: {selectedUser.email}</div>
          <div>ID: {selectedUser.id}</div>
        </UserProfile>
      )}
    </div>
  )
}

export default GithubUsers

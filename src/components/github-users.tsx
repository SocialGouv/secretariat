import { useState } from "react"

import Users from "@/components/users/index"
import useGithubUsers from "@/services/github"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const GithubUsers = () => {
  const users = useGithubUsers()
  const [selectedUser, setSelectedUser] = useState<GithubUser>()

  return (
    <Users users={users}>
      <>
        <UserList
          users={users}
          selectedUser={selectedUser}
          getUserData={(user) => user as User}
          onSelect={(user) => setSelectedUser(user as GithubUser)}
        />
        {selectedUser && (
          <UserProfile>
            <div>Nom: {selectedUser.name}</div>
            <div>Login: {selectedUser.login}</div>
            <div>Email: {selectedUser.email}</div>
            <div>ID: {selectedUser.id}</div>
          </UserProfile>
        )}
      </>
    </Users>
  )
}

export default GithubUsers

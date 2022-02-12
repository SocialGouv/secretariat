import { useEffect, useState } from "react"

import Users from "@/components/users/index"
import useZammadUsers from "@/services/zammad"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const ZammadUsers = () => {
  const users = useZammadUsers()
  const [selectedUser, setSelectedUser] = useState<ZammadUser>()

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
      </>
    </Users>
  )
}

export default ZammadUsers

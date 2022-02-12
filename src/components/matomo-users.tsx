import { useEffect, useState } from "react"

import Users from "@/components/users/index"
import useMatomoUsers from "@/services/matomo"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const MatomoUsers = () => {
  const users = useMatomoUsers()
  const [selectedUser, setSelectedUser] = useState<MatomoUser>()

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
          getUserData={(user) => user as User}
          onSelect={(user) => setSelectedUser(user as MatomoUser)}
        />
        {selectedUser && (
          <UserProfile>
            <div>Login: {selectedUser.login}</div>
            <div>Email: {selectedUser.email}</div>
            <div>Date de création: {selectedUser.date_registered}</div>
            <div>2FA acitvé: {selectedUser.uses_2fa ? "oui" : "non"}</div>
          </UserProfile>
        )}
      </>
    </Users>
  )
}

export default MatomoUsers

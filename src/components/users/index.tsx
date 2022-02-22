import { useEffect, useState } from "react"

import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const Users = ({ users }: { users?: User[] }) => {
  const [selectedUser, setSelectedUser] = useState<User>()

  useEffect(() => {
    if (users && users.length) {
      setSelectedUser(users[0])
    }
  }, [users])

  return (
    <>
      {!users ? (
        <Loader size="lg" />
      ) : !users.length ? (
        <div className="no-users">
          <div className="callout">Aucun utilisateur pour le moment...</div>
        </div>
      ) : (
        <div className="users">
          <UserList
            users={users}
            selectedUser={selectedUser}
            onSelect={(user) => setSelectedUser(user)}
          />
          {selectedUser && <UserProfile user={selectedUser} />}
        </div>
      )}
    </>
  )
}

export default Users

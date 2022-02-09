import { useState } from "react"

import useOVHUsers from "@/services/ovh"
import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const OVHUsers = () => {
  const users = useOVHUsers()
  const [selectedUser, setSelectedUser] = useState<OVHUser>()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return (
    <div className="github-users">
      <UserList
        users={users}
        selectedUser={selectedUser}
        getUserData={(user) => {
          const { login, firstName, lastName, primaryEmailAddress } =
            user as OVHUser
          return {
            login,
            name: firstName && `${firstName} ${lastName}`,
            email: primaryEmailAddress,
          }
        }}
        onSelect={(user) => setSelectedUser(user as OVHUser)}
      />
      {selectedUser && (
        <UserProfile>
          <div>
            {" "}
            Nom:{" "}
            {selectedUser.firstName
              ? `${selectedUser.firstName} ${selectedUser.lastName}`
              : selectedUser.displayName}{" "}
          </div>
          <div>Login: {selectedUser.login}</div>
          <div>Email: {selectedUser.primaryEmailAddress}</div>
          <div>ID: {selectedUser.id}</div>
          <div>Date de création: {selectedUser.creationDate}</div>
        </UserProfile>
      )}
    </div>
  )
}

export default OVHUsers

import { useEffect } from "react"

import useUsers from "@/hooks/use-users"
import useSelectedUser from "@/hooks/use-selected-user"
import UserProfile from "@/components/users/user-profile"

const UserSelected = ({
  onUserDrop,
  onUserEdit,
  onAccountsChange,
  onToggleAccount,
}: {
  onUserDrop: (user: User) => void
  onUserEdit: (user: User) => void
  onAccountsChange: (account: ServiceAccount) => void
  onToggleAccount: (account: AccountToToggle) => void
}) => {
  const users = useUsers()
  const { selectedUser, setSelectedUser } = useSelectedUser()

  useEffect(() => {
    if (users && users.length && selectedUser) {
      const user = users.find((u) => u.id === selectedUser.id)
      setSelectedUser(user ? user : null)
    }
  })

  return (
    <div className="user-selected">
      <div className="box sticky-container">
        {selectedUser ? (
          <UserProfile
            user={selectedUser}
            onUserDrop={onUserDrop}
            onUserEdit={onUserEdit}
            onAccountsChange={onAccountsChange}
            onToggleAccount={onToggleAccount}
          />
        ) : (
          <div className="no-user-selected">
            <div>Aucun utilisateur sélectionné.</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserSelected

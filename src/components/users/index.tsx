import { useEffect, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useSWRConfig } from "swr"

import statusOk from "@/utils/status-ok"
import UserList from "@/components/users/user-list"
import { usePagedUsers } from "@/hooks/use-paged-users"
import useSelectedUser from "@/hooks/use-selected-user"
import AccountDeleteModal from "./delete-account-modal"
import UserSelected from "@/components/users/user-selected"
import {
  revokeAccount,
  detachUserServiceAccount,
  mapUser,
  mergeUsers,
  mutateUser,
} from "@/hooks/use-users"

const Users = () => {
  const { mutate } = useSWRConfig()
  const { pagedUsers } = usePagedUsers()
  const [droppedUser, setDroppedUser] = useState<User>()
  const { selectedUser, setSelectedUser } = useSelectedUser()
  const [accountToDelete, setAccountToDelete] = useState<ServiceAccount>()

  useEffect(() => {
    if (pagedUsers && pagedUsers.length && !selectedUser) {
      setSelectedUser(pagedUsers[0])
    }
  }, [pagedUsers, selectedUser, setSelectedUser])

  const handleUserEdit = async (user: User) => {
    setSelectedUser(mapUser(user))
    await mutateUser(user)
    mutate("/users")
  }

  const handleAccountsChange = async (account: ServiceAccount) => {
    const services = selectedUser?.services.filter((a) => a.id !== account.id)
    if (selectedUser && services) {
      await detachUserServiceAccount(account)
      mutate("/users")
    }
  }

  const handleUserRemoval = async (user: User) => {
    if (pagedUsers && selectedUser) {
      await mergeUsers(selectedUser, user)
      mutate("/users")
    }
  }

  const handleDeleteAccount = (account: ServiceAccount) => {
    setAccountToDelete(account)
  }

  const handleConfirmDeleteAccount = async () => {
    const { status, body } = await revokeAccount(
      accountToDelete as ServiceAccount
    )
    if (statusOk(status)) {
      mutate("/users")
    }
    return { status, body }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="users-view">
        <AccountDeleteModal
          isOpen={!!accountToDelete}
          onConfirm={handleConfirmDeleteAccount}
          onRequestClose={() => setAccountToDelete(undefined)}
        />
        <UserList
          users={pagedUsers}
          droppedUser={droppedUser}
          onUserSelect={(user) => setSelectedUser(user)}
          onUserRemove={(user) => handleUserRemoval(user)}
        />
        <UserSelected
          onUserDrop={setDroppedUser}
          onUserEdit={handleUserEdit}
          onAccountsChange={(account) => handleAccountsChange(account)}
          onDeleteAccount={handleDeleteAccount}
        />
      </div>
    </DndProvider>
  )
}

export default Users

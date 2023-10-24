import { useEffect, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useSWRConfig } from "swr"

import statusOk from "@/utils/status-ok"
import UserList from "@/components/users/user-list"
import { usePagedUsers } from "@/hooks/use-paged-users"
import useSelectedUser from "@/hooks/use-selected-user"
import UserSelected from "@/components/users/user-selected"
import {
  disableAccount,
  detachUserServiceAccount,
  mapUser,
  mergeUsers,
  mutateUser,
  enableAccount,
} from "@/hooks/use-users"
import AccountToggleModal from "./toggle-account-modal"

const Users = () => {
  const { mutate } = useSWRConfig()
  const { pagedUsers } = usePagedUsers()
  const [droppedUser, setDroppedUser] = useState<User>()
  const { selectedUser, setSelectedUser } = useSelectedUser()
  const [accountToToggle, setAccountToToggle] = useState<AccountToToggle>()

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

  const handleToggleAccount = (accountToToggle: AccountToToggle) => {
    setAccountToToggle(accountToToggle)
  }

  const handleConfirmToggleAccount = async (
    accountToToggle: AccountToToggle
  ) => {
    let response
    if (accountToToggle.disable) {
      response = await disableAccount(accountToToggle.account)
    } else {
      response = await enableAccount(accountToToggle.account)
    }
    if (statusOk(response.status)) {
      mutate("/users")
    }
    return response
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="users-view">
        <AccountToggleModal
          disable={accountToToggle?.disable}
          isOpen={!!accountToToggle}
          onConfirm={() =>
            handleConfirmToggleAccount(accountToToggle as AccountToToggle)
          }
          onRequestClose={() => setAccountToToggle(undefined)}
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
          onToggleAccount={handleToggleAccount}
        />
      </div>
    </DndProvider>
  )
}

export default Users

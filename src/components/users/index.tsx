import { useSWRConfig } from "swr"
import { DndProvider } from "react-dnd"
import { useEffect, useState } from "react"
import { HTML5Backend } from "react-dnd-html5-backend"

import useToken from "@/hooks/use-token"
import UserList from "@/components/users/user-list"
import { usePagedUsers } from "@/hooks/use-paged-users"
import useSelectedUser from "@/hooks/use-selected-user"
import UserSelected from "@/components/users/user-selected"
import {
  detachUserServiceAccount,
  mapUser,
  mergeUsers,
  mutateUser,
} from "@/hooks/use-users"

const Users = () => {
  const [token] = useToken()
  const { mutate } = useSWRConfig()
  const { pagedUsers } = usePagedUsers()
  const [droppedUser, setDroppedUser] = useState<User>()
  const { selectedUser, setSelectedUser } = useSelectedUser()

  useEffect(() => {
    if (pagedUsers && pagedUsers.length && !selectedUser) {
      setSelectedUser(pagedUsers[0])
    }
  }, [pagedUsers, selectedUser, setSelectedUser])

  const handleUserEdit = async (user: User) => {
    setSelectedUser(mapUser(user))
    await mutateUser(user, token)
    mutate("/users")
  }

  const handleAccountsChange = async (user: User, account: ServiceAccount) => {
    const services = selectedUser?.services.filter((a) => a.id !== account.id)
    if (selectedUser && services) {
      // setSelectedUser(mapUser({ ...selectedUser, services }))
      await detachUserServiceAccount(account, token)
      mutate("/users")
    }
  }

  const handleUserRemoval = async (user: User) => {
    if (pagedUsers && selectedUser) {
      const updatedUser = await mergeUsers(selectedUser, user, token)
      // setSelectedUser(updatedUser)
      mutate("/users")
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="users-view">
        <UserList
          users={pagedUsers}
          droppedUser={droppedUser}
          onUserSelect={(user) => setSelectedUser(user)}
          onUserRemove={(user) => handleUserRemoval(user)}
        />
        <UserSelected
          onUserDrop={setDroppedUser}
          onUserEdit={handleUserEdit}
          onAccountsChange={(user, account) =>
            handleAccountsChange(user, account)
          }
        />
      </div>
    </DndProvider>
  )
}

export default Users

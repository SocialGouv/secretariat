import { useSWRConfig } from "swr"
import { DndProvider } from "react-dnd"
import { useEffect, useState } from "react"
import { HTML5Backend } from "react-dnd-html5-backend"

import useToken from "@/hooks/use-token"
import UserList from "@/components/users/user-list"
import { usePagedUsers } from "@/hooks/use-paged-users"
import { mapUser, mergeUsers, mutateUser } from "@/hooks/use-users"
import UserSelected from "@/components/users/user-selected"

const Users = () => {
  const [token] = useToken()
  const { mutate } = useSWRConfig()
  const { pagedUsers } = usePagedUsers()
  const [droppedUser, setDroppedUser] = useState<User>()
  const [selectedUser, setSelectedUser] = useState<User>()

  useEffect(() => {
    if (pagedUsers && pagedUsers.length && !selectedUser) {
      setSelectedUser(pagedUsers[0])
    }
  }, [pagedUsers, selectedUser])

  const handleUserEdit = async (user: User) => {
    setSelectedUser(mapUser(user))
    await mutateUser(user, token)
    mutate("/users")
  }

  // const handleAccountsChanged = async (user: User) => {
  //   setSelectedUser(mapUser(user))
  //   mutate("/users")
  // }

  const handleAccountDetach = async (user: User, account: ServiceAccount) => {
    console.log("handleAccountDetach:", user, account)
  }

  const handleUserRemoval = async (user: User) => {
    if (pagedUsers && selectedUser) {
      const updatedUser = await mergeUsers(selectedUser, user, token)
      setSelectedUser(updatedUser)
      mutate("/users")
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="users-view">
        <UserList
          users={pagedUsers}
          droppedUser={droppedUser}
          selectedUser={selectedUser}
          onUserSelect={(user) => setSelectedUser(user)}
          onUserRemove={(user) => handleUserRemoval(user)}
        />
        <UserSelected
          user={selectedUser}
          onUserDrop={setDroppedUser}
          onUserEdit={handleUserEdit}
          onAccountDetach={handleAccountDetach}
          // onAccountsChanged={(user) => handleAccountsChanged(user)}
        />
      </div>
    </DndProvider>
  )
}

export default Users

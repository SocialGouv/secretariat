import { useSWRConfig } from "swr"
import { DndProvider } from "react-dnd"
import { useEffect, useState } from "react"
import { HTML5Backend } from "react-dnd-html5-backend"

import useToken from "@/hooks/use-token"
import UserList from "@/components/users/user-list"
import { usePagedUsers } from "@/hooks/use-paged-users"
import { mergeUsers, mutateUser } from "@/hooks/use-users"
import UserSelected from "@/components/users/user-selected"

const Users = () => {
  const [token] = useToken()
  const { mutate } = useSWRConfig()
  const { pagedUsers } = usePagedUsers()
  const [droppedUser, setDroppedUser] = useState<User>()
  const [selectedUser, setSelectedUser] = useState<User>()

  useEffect(() => {
    if (pagedUsers && pagedUsers.length) {
      const user = pagedUsers[0]
      if (!selectedUser || user.id === selectedUser.id) {
        setSelectedUser(pagedUsers[0])
      }
    }
  }, [pagedUsers, selectedUser])

  const handleUserEdit = async (user: User) => {
    setSelectedUser(user)
    await mutateUser(user, token)
    mutate("/users")
  }

  const handleUserRemoval = async (user: User) => {
    if (pagedUsers && selectedUser) {
      // setDroppedUser(undefined)
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
        />
      </div>
    </DndProvider>
  )
}

export default Users

import { useSWRConfig } from "swr"
import { DndProvider } from "react-dnd"
import { useEffect, useState } from "react"
import { HTML5Backend } from "react-dnd-html5-backend"

import useToken from "@/hooks/use-token"
import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import { usePagedUsers } from "@/hooks/use-paged-users"
import UserProfile from "@/components/users/user-profile"
import { mergeUsers, mutateUser } from "@/hooks/use-users"
import ConfirmModal from "@/components/users/confirm-modal"

const Users = () => {
  const [token] = useToken()
  const { mutate } = useSWRConfig()
  const { pagedUsers } = usePagedUsers()
  const [droppedUser, setDroppedUser] = useState<User>()
  const [selectedUser, setSelectedUser] = useState<User>()

  useEffect(() => {
    if (!selectedUser && pagedUsers && pagedUsers.length) {
      setSelectedUser(pagedUsers[0])
    }
  }, [pagedUsers, selectedUser])

  const handleUserDrop = (user: User) => {
    setDroppedUser(user)
  }

  const handleUserEdit = async (user: User) => {
    setSelectedUser(user)
    await mutateUser(user, token)
    mutate("/users")
  }

  const handleConfirm = async () => {
    if (pagedUsers && selectedUser && droppedUser) {
      const updatedUser = await mergeUsers(selectedUser, droppedUser, token)
      setSelectedUser(updatedUser)
      mutate("/users")
      setDroppedUser(undefined)
    }
  }

  return (
    <>
      {!pagedUsers ? (
        <Loader size="lg" />
      ) : !pagedUsers.length ? (
        <div className="no-users">
          <div className="callout">Aucun utilisateur pour le moment...</div>
        </div>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="users-view">
            <ConfirmModal
              isOpen={!!droppedUser}
              onConfirm={handleConfirm}
              droppedUser={droppedUser}
              selectedUser={selectedUser}
              onRequestClose={() => setDroppedUser(undefined)}
            />
            <UserList
              users={pagedUsers}
              droppedUser={droppedUser}
              selectedUser={selectedUser}
              onSelect={(user) => setSelectedUser(user)}
            />
            {selectedUser && (
              <UserProfile
                user={selectedUser}
                onUserDrop={handleUserDrop}
                onUserEdit={handleUserEdit}
              />
            )}
          </div>
        </DndProvider>
      )}
    </>
  )
}

export default Users

import { useSWRConfig } from "swr"
import { DndProvider } from "react-dnd"
import { useEffect, useState } from "react"
import { HTML5Backend } from "react-dnd-html5-backend"

import useToken from "@/services/token"
import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"
import ConfirmModal from "@/components/users/confirm-modal"
import { mergeUsers, mutateUser } from "@/services/use-users"

import { usePagedUsers } from "@/services/use-paged-users"

const Users = () => {
  const { mutate } = useSWRConfig()
  const { pagedUsers } = usePagedUsers()

  const [token] = useToken()
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

import { DndProvider } from "react-dnd"
import { useEffect, useState } from "react"
import { HTML5Backend } from "react-dnd-html5-backend"

import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"
import ConfirmModal from "./confirm-modal"
import { mergeUsers } from "@/services/users"
import useToken from "@/services/token"

const Users = ({ users }: { users?: User[] }) => {
  const [token] = useToken()
  const [droppedUser, setDroppedUser] = useState<User>()
  const [selectedUser, setSelectedUser] = useState<User>()

  useEffect(() => {
    if (!selectedUser && users && users.length) {
      setSelectedUser(users[0])
    }
  }, [users, selectedUser])

  const handleUserDrop = (user: User) => {
    setDroppedUser(user)
    return user
  }

  const handleConfirm = async () => {
    if (selectedUser && droppedUser) {
      const user = await mergeUsers(selectedUser, droppedUser, token)

      if (user) {
        setDroppedUser(undefined)
        // trigger a refresh ?
      }
    }
  }

  return (
    <>
      {!users ? (
        <Loader size="lg" />
      ) : !users.length ? (
        <div className="no-users">
          <div className="callout">Aucun utilisateur pour le moment...</div>
        </div>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className="users-view">
            <ConfirmModal
              isOpen={!!droppedUser}
              droppedUser={droppedUser}
              selectedUser={selectedUser}
              onConfirm={handleConfirm}
              onRequestClose={() => setDroppedUser(undefined)}
            />
            <UserList
              users={users}
              selectedUser={selectedUser}
              onSelect={(user) => setSelectedUser(user)}
            />
            {selectedUser && (
              <UserProfile user={selectedUser} onUserDrop={handleUserDrop} />
            )}
          </div>
        </DndProvider>
      )}
    </>
  )
}

export default Users

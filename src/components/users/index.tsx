import { DndProvider } from "react-dnd"
import { useEffect, useState } from "react"
import { HTML5Backend } from "react-dnd-html5-backend"

import useToken from "@/services/token"
import { mergeUsers } from "@/services/users"
import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"
import ConfirmModal from "@/components/users/confirm-modal"

import useSWR, { useSWRConfig } from "swr"
import { usePagedUsers } from "@/services/users"

const Users = () => {
  const { pagedUsers, setPagedUsers } = usePagedUsers()
  const { mutate } = useSWRConfig()

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
    return user
  }

  const handleConfirm = async () => {
    if (selectedUser && droppedUser) {
      const newUsers = pagedUsers?.filter(
        (user) => user.id !== selectedUser.id || user.id !== droppedUser.id
      )
      console.log("COUNT", pagedUsers?.length, newUsers?.length)

      // setPagedUsers(newUsers, false)
      const user = await mergeUsers(selectedUser, droppedUser, token)

      if (newUsers && user) {
        setPagedUsers([...newUsers, user], false)
        mutate("/users")
      }

      if (user) {
        setDroppedUser(undefined)
        // mutate("/users")
        // trigger a refresh ?
      }
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

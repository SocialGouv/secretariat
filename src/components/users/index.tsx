import { useSWRConfig } from "swr"
import { DndProvider } from "react-dnd"
import { useCallback, useEffect, useState } from "react"
import { HTML5Backend } from "react-dnd-html5-backend"

import useToken from "@/hooks/use-token"
import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import { usePagedUsers } from "@/hooks/use-paged-users"
import UserProfile from "@/components/users/user-profile"
import { mergeUsers, mutateUser } from "@/hooks/use-users"

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

  // const handleConfirm = useCallback(async () => {
  //   if (pagedUsers && selectedUser && droppedUser) {
  //     const updatedUser = await mergeUsers(selectedUser, droppedUser, token)
  //     setSelectedUser(updatedUser)
  //     mutate("/users")
  //     setDroppedUser(undefined)
  //   }
  // }, [droppedUser, mutate, pagedUsers, selectedUser, token])

  // useEffect(() => {
  //   if (droppedUser) {
  //     handleConfirm()
  //   }
  // }, [droppedUser, handleConfirm])

  const handleUserRemoval = async (user: User) => {
    if (pagedUsers && selectedUser) {
      console.log("!!! handleUserRemoval !!!")
      console.log(
        "USER TO KEEP",
        selectedUser.name,
        selectedUser.id,
        selectedUser
      )
      console.log("USER TO DROP", user.name, user.id, user)

      setDroppedUser(undefined)
      const updatedUser = await mergeUsers(selectedUser, user, token)
      setSelectedUser(updatedUser)
      mutate("/users")
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
            <UserList
              users={pagedUsers}
              droppedUser={droppedUser}
              selectedUser={selectedUser}
              onUserSelect={(user) => setSelectedUser(user)}
              onUserRemove={(user) => handleUserRemoval(user)}
            />
            {selectedUser && (
              <UserProfile
                user={selectedUser}
                onUserDrop={setDroppedUser}
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

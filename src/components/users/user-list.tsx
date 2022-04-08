import usePaging from "@/hooks/use-paging"
import Loader from "@/components/common/loader"
import UserItem from "@/components/users/user-item"
import useFilteredUsers from "@/hooks/use-filtered-users"
import useSelectedUser from "@/hooks/use-selected-user"

const UserList = ({
  users = [],
  droppedUser,
  onUserSelect,
  onUserRemove,
}: {
  users?: User[]
  droppedUser?: User
  onUserSelect: (user: User) => void
  onUserRemove: (user: User) => void
}) => {
  const { selectedUser } = useSelectedUser()
  const { users: filteredUsers } = useFilteredUsers()
  const { page = 1, setPage, pageSize } = usePaging()

  return (
    <div className="user-list">
      {!filteredUsers ? (
        <Loader size="lg" />
      ) : (
        <>
          <ul>
            {users.map((user, i) => (
              <UserItem
                key={user.id}
                user={user}
                onClick={() => onUserSelect(user)}
                onRemove={() => onUserRemove(user)}
                dropped={droppedUser?.id === user.id}
                selected={selectedUser?.id === user.id}
              />
            ))}
          </ul>
          <button
            className="primary"
            onClick={() => setPage(page + 1)}
            disabled={
              (filteredUsers?.length || 0) > pageSize * page ? false : true
            }
          >
            Afficher plus d&apos;utilisateurs
          </button>
        </>
      )}
    </div>
  )
}

export default UserList

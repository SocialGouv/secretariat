import usePaging from "@/hooks/use-paging"
import Loader from "@/components/common/loader"
import UserItem from "@/components/users/user-item"
import useFilteredUsers from "@/hooks/use-filtered-users"

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
  const { users: filteredUsers } = useFilteredUsers()
  const { page = 1, setPage, pageSize } = usePaging()
  const disabled = (filteredUsers?.length || 0) > pageSize * page ? false : true

  return (
    <div className="user-list">
      {!filteredUsers ? (
        <Loader size="lg" />
      ) : (
        <>
          <ul>
            {users.map((user) => (
              <UserItem
                user={user}
                key={user.id}
                onClick={() => onUserSelect(user)}
                onRemove={() => onUserRemove(user)}
                dropped={droppedUser?.id === user.id}
              />
            ))}
          </ul>
          <button
            className="primary"
            disabled={disabled}
            onClick={() => setPage(page + 1)}
          >
            Afficher plus d&apos;utilisateurs
          </button>
        </>
      )}
    </div>
  )
}

export default UserList

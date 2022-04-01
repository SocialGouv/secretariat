import UserItem from "./user-item"
import usePaging from "@/hooks/use-paging"
import useFilteredUsers from "@/hooks/use-filtered-users"

const UserList = ({
  users = [],
  droppedUser,
  selectedUser,
  onUserSelect,
  onUserRemove,
}: {
  users?: User[]
  droppedUser?: User
  selectedUser?: User
  onUserSelect: (user: User) => void
  onUserRemove: (user: User) => void
}) => {
  const { users: filteredUsers } = useFilteredUsers()
  const { page = 1, setPage, pageSize } = usePaging()

  return (
    <div className="user-list">
      <ul>
        {users.map((user, i) => (
          <UserItem
            key={i}
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
        disabled={(filteredUsers?.length || 0) > pageSize * page ? false : true}
      >
        Afficher plus d&apos;utilisateurs
      </button>
    </div>
  )
}

export default UserList

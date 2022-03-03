import { useFilteredUsers, usePaging } from "@/services/users"
import UserItem from "./user-item"

const UserList = ({
  onSelect,
  users = [],
  selectedUser,
}: {
  users?: User[]
  selectedUser?: User
  onSelect: (user: User | undefined) => void
}) => {
  const { users: totalUsers } = useFilteredUsers()
  const { page = 1, setPage, pageSize } = usePaging()

  return (
    <div className="user-list">
      <ul>
        {users.map((user, i) => (
          <UserItem
            key={i}
            user={user}
            onClick={() => onSelect(user)}
            selected={selectedUser?.id === user.id}
          />
        ))}
      </ul>
      <button
        onClick={() => setPage(page + 1)}
        className="primary"
        disabled={totalUsers?.length || 0 > pageSize ? false : true}
      >
        Afficher plus d&apos;utilisateurs
      </button>
    </div>
  )
}

export default UserList

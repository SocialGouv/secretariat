import UserItem from "./user-item"
import usePaging from "@/services/use-paging"
import useFilteredUsers from "@/services/use-filtered-users"
import { haveSimilarServices } from "@/services/use-users"

const UserList = ({
  onSelect,
  users = [],
  droppedUser,
  selectedUser,
}: {
  users?: User[]
  droppedUser?: User
  selectedUser?: User
  onSelect: (user: User | undefined) => void
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
            onClick={() => onSelect(user)}
            dropped={droppedUser?.id === user.id}
            selected={selectedUser?.id === user.id}
            hasSimilarServices={
              !!selectedUser && !!haveSimilarServices(user, selectedUser)
            }
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

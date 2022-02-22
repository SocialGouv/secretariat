import { usePaging } from "@/services/users"
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
  const { page = 1, setPage } = usePaging()

  return (
    <div className="user-list">
      <ul>
        {users.map((user, i) => (
          <li
            key={i}
            className={`tile${
              selectedUser && selectedUser.id === user.id ? " selected" : ""
            }`}
            onClick={() => onSelect(user)}
          >
            <UserItem user={user} />
          </li>
        ))}
      </ul>
      <button
        onClick={() => setPage(page + 1)}
        className="primary w-full flex justify-center"
      >
        Afficher plus d&apos;utilisateurs
      </button>
    </div>
  )
}

export default UserList

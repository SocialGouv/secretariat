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
  console.log("SELECTED USER", selectedUser)

  return (
    <ul className="user-list">
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
  )
}
export default UserList

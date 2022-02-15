import UserItem from "./user-item"

const UserList = ({
  users,
  onSelect,
  getUserData,
  selectedUser,
}: {
  users: MixedUser[]
  selectedUser?: MixedUser
  getUserData: (user: MixedUser) => MixedUser
  onSelect: (user: MixedUser | undefined) => void
}) => {
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
          <UserItem user={getUserData(user)} />
        </li>
      ))}
    </ul>
  )
}

export default UserList

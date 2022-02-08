import { Dispatch, SetStateAction } from "react"
import UserItem from "./user-item"

export const UserList = ({
  users,
  onSelect,
  selectedUser,
}: {
  users: GithubUser[]
  selectedUser?: GithubUser
  onSelect: Dispatch<SetStateAction<GithubUser | undefined>>
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
          <UserItem
            name={user.name}
            email={user.email}
            login={user.login}
            avatarUrl={user.avatarUrl}
          />
        </li>
      ))}
    </ul>
  )
}

export default UserList

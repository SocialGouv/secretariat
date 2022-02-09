import UserItem from "./user-item"

export const UserList = ({
  users,
  onSelect,
  getUserData,
  selectedUser,
}: {
  users:
    | GithubUser[]
    | MatomoUser[]
    | SentryUser[]
    | OVHUser[]
    | ZammadUser[]
    | NextCloudUser[]
    | MattermostUser[]
  selectedUser?:
    | GithubUser
    | MatomoUser
    | SentryUser
    | OVHUser
    | ZammadUser
    | MattermostUser
    | NextCloudUser
  getUserData: (
    user:
      | GithubUser
      | MatomoUser
      | SentryUser
      | OVHUser
      | ZammadUser
      | MattermostUser
      | NextCloudUser
  ) => User
  onSelect: (
    user:
      | GithubUser
      | MatomoUser
      | SentryUser
      | OVHUser
      | ZammadUser
      | MattermostUser
      | NextCloudUser
      | undefined
  ) => void
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

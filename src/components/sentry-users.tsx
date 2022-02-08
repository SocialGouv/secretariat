import Image from "next/image"
import { useState } from "react"

const Users = ({ users = [] }: { users: SentryUser[] }) => {
  const [selectedUser, setSelectedUser] = useState<SentryUser>()

  return (
    <div className="github-users">
      <ul className="user-list">
        {users.map((user, i) => (
          <li
            key={i}
            className={`tile${
              selectedUser && selectedUser.email === user.email
                ? " selected"
                : ""
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="user">
              <Image
                width={48}
                height={48}
                alt="user avatar"
                src={user.user.avatarUrl}
              />
              <div className="info">
                <h3>{user.name}</h3>
                <div className="email">{user.email}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users

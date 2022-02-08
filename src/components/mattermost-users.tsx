import Image from "next/image"
import { useState } from "react"

const Users = ({ users = [] }: { users: MattermostUser[] }) => {
  const [selectedUser, setSelectedUser] = useState<MattermostUser>()

  return (
    <div className="github-users">
      <ul className="user-list">
        {users.map((user, i) => (
          <li
            key={i}
            className={`tile${
              selectedUser && selectedUser.username === user.username
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
                src="/images/avatar.jpeg"
              />
              <div className="info">
                <h3>
                  {user.first_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.username}{" "}
                  {user.first_name && <span>({user.username})</span>}
                </h3>
                <div className="email">{user.email}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div className="selected-user">
          <div className="sticky-container">
            <div className="user-profile">
              <div>
                Nom: {selectedUser.first_name} {selectedUser.last_name}
              </div>
              <div>username: {selectedUser.username}</div>
              <div>Email: {selectedUser.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users

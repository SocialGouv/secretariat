import Image from "next/image"
import { useState } from "react"

const Users = ({ users = [] }: { users: OVHUser[] }) => {
  const [selectedUser, setSelectedUser] = useState<OVHUser>()

  return (
    <div className="github-users">
      <ul className="user-list">
        {users.map((user, i) => (
          <li
            key={i}
            className={`tile${
              selectedUser && selectedUser.login === user.login
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
                  {user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user.displayName}{" "}
                  <span>({user.login})</span>
                </h3>
                <div className="email">{user.primaryEmailAddress}</div>
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
                Nom: {selectedUser.firstName} {selectedUser.lastName}
              </div>
              <div>Login: {selectedUser.login}</div>
              <div>Email: {selectedUser.primaryEmailAddress}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users

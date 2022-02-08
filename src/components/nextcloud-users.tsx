import Image from "next/image"
import { useState } from "react"

const Users = ({ users = [] }: { users: NextCloudUser[] }) => {
  const [selectedUser, setSelectedUser] = useState<NextCloudUser>()

  return (
    <div className="github-users">
      <ul className="user-list">
        {users.map((user, i) => (
          <li
            key={i}
            className={`tile${
              selectedUser && selectedUser.id === user.id ? " selected" : ""
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
                  {user.displayname || user.id}{" "}
                  {user.displayname && <span>({user.id})</span>}
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
              <div>Nom: {selectedUser.displayname}</div>
              <div>Email: {selectedUser.email}</div>
              <div>ID: {selectedUser.id}</div>
              <div>Dernière connexion: {selectedUser.lastLogin}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users

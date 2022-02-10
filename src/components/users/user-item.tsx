import Image from "next/image"

const UserItem = ({ user }: { user: User }) => {
  return (
    <div className="user">
      <Image
        width={48}
        height={48}
        alt="user avatar"
        src={user.avatarUrl || "/images/avatar.jpeg"}
      />
      <div className="info">
        <h3>
          {user.name || user.login}{" "}
          {user.name && user.login && <span>({user.login})</span>}
        </h3>
        <div className="email">{user.email}</div>
      </div>
    </div>
  )
}

export default UserItem

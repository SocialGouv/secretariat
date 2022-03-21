import Image from "next/image"

const UserHeader = ({ user }: { user: User }) => (
  <div className="user-header">
    <div className="avatar">
      <Image
        width={48}
        height={48}
        alt="user avatar"
        src={user.avatarUrl || "/images/user-avatar.svg"}
      />
    </div>
    <div className="info">
      <h3>{user.name}</h3>
      <div className="email">{user.email}</div>
    </div>
  </div>
)

export default UserHeader

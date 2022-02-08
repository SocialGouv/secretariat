import Image from "next/image"

const UserItem = ({
  name,
  email,
  login,
  avatarUrl,
}: {
  name: string
  login: string
  email: string
  avatarUrl: string
}) => {
  return (
    <div className="user">
      <Image width={48} height={48} alt="user avatar" src={avatarUrl} />
      <div className="info">
        <h3>
          {name || login} {name && <span>({login})</span>}
        </h3>
        <div className="email">{email}</div>
      </div>
    </div>
  )
}

export default UserItem

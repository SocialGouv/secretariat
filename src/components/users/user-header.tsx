import Image from "next/image"

const UserDefaultAvatar = () => (
  <svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <path
      transform="translate(-2 -2)"
      d="M16,8a5,5,0,1,0,5,5A5,5,0,0,0,16,8Z"
    />
    <path
      transform="translate(-2 -2)"
      d="M16,2A14,14,0,1,0,30,16,14.0158,14.0158,0,0,0,16,2Zm7.9925,22.9258A5.0016,5.0016,0,0,0,19,20H13a5.0016,5.0016,0,0,0-4.9925,4.9258,12,12,0,1,1,15.985,0Z"
    />
  </svg>
)

const UserAvatar = ({ url }: { url: string }) => (
  <>
    {url ? (
      // <div className="avatar-img">
      <Image width={44} height={44} alt="user avatar" src={url} />
    ) : (
      // </div>
      <UserDefaultAvatar />
    )}
  </>
)

const UserHeader = ({ user }: { user: User }) => (
  <div className="user-header">
    <div className="avatar">
      <UserAvatar url={user?.avatarUrl} />
    </div>
    <div className="info">
      <h3>{user.name}</h3>
      <div className="email">{user.email}</div>
    </div>
  </div>
)

export default UserHeader

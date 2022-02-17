import Image from "next/image"

const GithubIcon = () => (
  <Image src={"/images/github.png"} height={32} width={32} />
)
const MatomoIcon = () => (
  <Image src={"/images/matomo.png"} height={32} width={32} />
)
const SentryIcon = () => (
  <Image src={"/images/sentry.png"} height={32} width={32} />
)
const MattermostIcon = () => (
  <Image src={"/images/mattermost.svg"} height={32} width={32} />
)
const ZammadIcon = () => (
  <Image src={"/images/zammad.png"} height={32} width={32} />
)
const NextCloudIcon = () => (
  <Image src={"/images/nextcloud.png"} height={32} width={32} />
)
const OVHIcon = () => <Image src={"/images/ovh.png"} height={32} width={32} />

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
      <div className="services">
        {user.github && <GithubIcon />}
        {user.matomo && <MatomoIcon />}
        {user.mattermost && <MattermostIcon />}
        {user.nextcloud && <NextCloudIcon />}
        {user.zammad && <ZammadIcon />}
        {user.ovh && <OVHIcon />}
        {user.sentry && <SentryIcon />}
      </div>
    </div>
  )
}

export default UserItem

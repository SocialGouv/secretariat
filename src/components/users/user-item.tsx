import Image from "next/image"

import OVHLogo from "../common/logo/ovh"
import GithubLogo from "../common/logo/github"
import SentryLogo from "../common/logo/sentry"
import MatomoLogo from "../common/logo/matomo"
import ZammadLogo from "../common/logo/zammad"
import NextCloudLogo from "../common/logo/nextcloud"
import MattermostLogo from "../common/logo/mattermost"

const UserItem = ({ user }: { user: User }) => {
  return (
    <div className="user">
      <div className="details">
        <div>
          <Image
            width={48}
            height={48}
            alt="user avatar"
            src={user.avatarUrl || "/images/avatar.jpeg"}
          />
        </div>
        <div className="info">
          <h3>
            {user.name || user.login}{" "}
            {user.name && user.login && <span>({user.login})</span>}
          </h3>
          <div className="email">{user.email}</div>
        </div>
      </div>
      <div className="services">
        <div className={user.zammad ? "" : "opacity-25"}>
          <ZammadLogo size="s" />
        </div>
        <div className={user.nextcloud ? "" : "opacity-25"}>
          <NextCloudLogo size="s" />
        </div>
        <div className={user.ovh ? "" : "opacity-25"}>
          <OVHLogo size="s" />
        </div>
        <div className={user.sentry ? "" : "opacity-25"}>
          <SentryLogo size="s" />
        </div>
        <div className={user.matomo ? "" : "opacity-25"}>
          <MatomoLogo size="s" />
        </div>
        <div className={user.mattermost ? "" : "opacity-25"}>
          <MattermostLogo size="s" />
        </div>
        <div className={user.github ? "" : "opacity-25"}>
          <GithubLogo size="s" />
        </div>
      </div>
    </div>
  )
}

export default UserItem

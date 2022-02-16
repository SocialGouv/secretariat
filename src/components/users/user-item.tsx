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
        {user.github && (
          <div>
            <GithubLogo size="s" />
          </div>
        )}
        {user.matomo && (
          <div>
            <MatomoLogo size="s" />
          </div>
        )}
        {user.mattermost && (
          <div>
            <MattermostLogo size="s" />
          </div>
        )}
        {user.nextcloud && (
          <div>
            <NextCloudLogo size="s" />
          </div>
        )}
        {user.zammad && (
          <div>
            <ZammadLogo size="s" />
          </div>
        )}
        {user.ovh && (
          <div>
            <OVHLogo size="s" />
          </div>
        )}
        {user.sentry && (
          <div>
            <SentryLogo size="s" />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserItem

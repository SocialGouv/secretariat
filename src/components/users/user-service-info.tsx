import { format } from "date-fns"
import { useSpring, animated, useSpringRef } from "react-spring"

import ServiceLogo from "@/components/common/service-logo"
import { TOGGLEABLE_SERVICE } from "@/utils/SERVICES"

const DATE_FORMAT = "dd/MM/Y HH:mm:ss"

const getFormattedDate = (date: Date | string) =>
  date ? format(new Date(date), DATE_FORMAT) : ""

const InfoTable = ({
  data,
}: {
  data: Record<string, string | boolean | Date>
}) => (
  <div className="info-table grid grid-flow-row grid-cols-3">
    {Object.entries(data).map(([key, value], i) => (
      <div key={i} className="contents">
        <div>{key}</div>
        <div className="col-span-2">{value}</div>
      </div>
    ))}
  </div>
)

const GithubUserInfo = ({
  account: {
    data: { avatarUrl: _avatarUrl, teams, ...info },
  },
}: {
  account: GithubServiceAccount
}) => (
  <>
    <InfoTable data={info as never} />
    <div className="teams">
      {teams?.map((team, i) => (
        <div key={i} className="tag">
          {team.name}
        </div>
      ))}
    </div>
  </>
)

const MatomoUserInfo = ({
  account: {
    data: { email, login, uses_2fa, date_registered, sites },
  },
}: {
  account: MatomoServiceAccount
}) => (
  <>
    <InfoTable data={{ email, login, uses_2fa, date_registered }}></InfoTable>
    <div className="teams">
      {sites?.map((site, index) => (
        <div key={index} className="tag">
          {site.name}
        </div>
      ))}
    </div>
  </>
)

const SentryUserInfo = ({
  account: {
    data: { user, projects, flags: _flags, ...info },
  },
}: {
  account: SentryServiceAccount
}) => (
  <>
    <InfoTable data={{ ...info, uses_2fa: user.has2fa }} />
    <div className="teams">
      {projects?.map((project, index) => (
        <div key={index} className="tag">
          {project}
        </div>
      ))}
    </div>
  </>
)

const MattermostUserInfo = ({
  account: {
    data: { id, first_name, last_name, email, create_at, username, teams },
  },
}: {
  account: MattermostServiceAccount
}) => (
  <>
    <InfoTable
      data={{
        username,
        first_name,
        last_name,
        email,
        id,
        create_at: getFormattedDate(create_at),
      }}
    />
    <div className="teams">
      {teams?.map((team, index) => (
        <div key={index} className="tag">
          {team.name}
        </div>
      ))}
    </div>
  </>
)

const OVHUserInfo = ({
  account: {
    data: {
      id,
      login,
      lastName,
      firstName,
      creationDate,
      displayName,
      primaryEmailAddress,
    },
  },
}: {
  account: OVHServiceAccount
}) => (
  <InfoTable
    data={{
      id,
      login,
      lastName,
      firstName,
      creationDate,
      displayName,
      primaryEmailAddress,
    }}
  />
)

const NextCloudUserInfo = ({
  account: {
    data: { id, email, lastLogin, displayname, groups },
  },
}: {
  account: NextCloudServiceAccount
}) => (
  <>
    <InfoTable
      data={{
        id,
        email,
        displayname,
        lastLogin: getFormattedDate(lastLogin),
      }}
    />
    <div className="teams">
      {groups?.map((group, index) => (
        <div key={index} className="tag">
          {group}
        </div>
      ))}
    </div>
  </>
)

const ZammadUserInfo = ({
  account: {
    data: { id, email, login, created_at, lastname, firstname, groups },
  },
}: {
  account: ZammadServiceAccount
}) => (
  <>
    <InfoTable data={{ id, email, login, created_at, lastname, firstname }} />
    <div className="teams">
      {groups?.map((group, index) => (
        <div key={index} className="tag">
          {group.name}
        </div>
      ))}
    </div>
  </>
)

const UserServiceInfo = ({
  user,
  account,
  isSingleAccount,
  onDetachAccount,
  onToggleAccount,
}: {
  user: User
  account: ServiceAccount
  isSingleAccount: boolean
  onDetachAccount: (account: ServiceAccount) => void
  onToggleAccount: (account: AccountToToggle) => void
}) => {
  const ref = useSpringRef()

  const [styles, spring] = useSpring(() => ({
    ref,
    config: { duration: 200 },
    from: { height: "100%", opacity: 1 },
    to: [{ opacity: 0 }, { height: "0" }],
    onRest: () => onDetachAccount(account),
  }))

  return (
    <animated.div style={styles} className="service">
      <h3>
        <div className="icon-title">
          <div className="icon">
            <ServiceLogo name={account.type} />
          </div>
          <div className="title">{account.type}</div>
        </div>
        <div className="controls">
          {!isSingleAccount && (
            <button
              title="détacher"
              className="secondary sm icon"
              onClick={() => spring.start()}
            >
              <i className="ri-eject-fill"></i>
            </button>
          )}
          {TOGGLEABLE_SERVICE.includes(account.type) && (
            <>
              {account.disabled ? (
                <>
                  {!user.email && account.type === "ovh" ? (
                    <button
                      title="email de contact indisponible"
                      className="btn sm "
                      disabled
                    >
                      activer
                    </button>
                  ) : (
                    <button
                      className="primary sm"
                      onClick={() =>
                        onToggleAccount({ disable: false, account })
                      }
                    >
                      activer
                    </button>
                  )}
                </>
              ) : (
                <button
                  className="secondary sm"
                  onClick={() => onToggleAccount({ disable: true, account })}
                >
                  désactiver
                </button>
              )}
            </>
          )}
        </div>
      </h3>
      {account.type === "github" && <GithubUserInfo account={account} />}
      {account.type === "matomo" && <MatomoUserInfo account={account} />}
      {account.type === "sentry" && <SentryUserInfo account={account} />}
      {account.type === "mattermost" && (
        <MattermostUserInfo account={account} />
      )}
      {account.type === "ovh" && <OVHUserInfo account={account} />}
      {account.type === "nextcloud" && <NextCloudUserInfo account={account} />}
      {account.type === "zammad" && <ZammadUserInfo account={account} />}
    </animated.div>
  )
}

export default UserServiceInfo

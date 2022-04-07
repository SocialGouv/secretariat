import { useSpring, animated } from "react-spring"
import { useCallback, useEffect, useRef, useState } from "react"

import fetcher from "@/utils/fetcher"
import useToken from "@/hooks/use-token"
import ServiceLogo from "@/components/common/service-logo"
import { insertUser, updateService } from "@/queries/index"

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
    data: { avatarUrl, teams, ...info },
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

const SentryUserInfo = ({
  account: {
    data: { user, projects, flags, ...info },
  },
}: {
  account: SentryServiceAccount
}) => <InfoTable data={{ ...info, uses_2fa: user.has2fa }} />

const MattermostUserInfo = ({
  account: {
    data: { id, first_name, last_name, email, create_at, username },
  },
}: {
  account: MattermostServiceAccount
}) => (
  <InfoTable data={{ username, first_name, last_name, email, id, create_at }} />
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
    data: { id, email, lastLogin, displayname },
  },
}: {
  account: NextCloudServiceAccount
}) => <InfoTable data={{ id, email, lastLogin, displayname }} />

const ZammadUserInfo = ({
  account: {
    data: { id, email, login, created_at, lastname, firstname },
  },
}: {
  account: ZammadServiceAccount
}) => <InfoTable data={{ id, email, login, created_at, lastname, firstname }} />

const UserServiceInfo = ({
  account,
  isSingleAccount,
  onDetachAccount,
}: {
  account: ServiceAccount
  isSingleAccount: boolean
  // onDetachAccount: (account: User) => void
  onDetachAccount: (account: ServiceAccount) => void
}) => {
  // const [token] = useToken()
  const ref = useRef(null)
  const [styles, spring] = useSpring(() => ({}))
  const [detached, setDetached] = useState(false)

  const onDetachAccountCallback = useCallback(
    () => onDetachAccount(account),
    [onDetachAccount, account]
  )

  useEffect(() => {
    if (ref && ref.current) {
      console.log("REF", ref.current)
      const el = ref.current as HTMLElement
      spring.update({
        config: { duration: 200 },
        to: [{ opacity: 0 }, { height: 0 }],
        from: { opacity: 1, height: el.offsetHeight },
        onRest: () => el.offsetHeight === 0 && onDetachAccountCallback(),
      })
    }
  }, [ref, spring, onDetachAccountCallback])

  useEffect(() => {
    console.log("useEffect detached", detached)
    if (detached) spring.start()
  }, [detached, spring])

  // const handleUnmergeButton = async (account: ServiceAccount) => {
  //   if (isSingleAccount) {
  //     return
  //   }

  //   // Create a new user for the unmerged account
  //   const {
  //     insert_users_one: { id: userId },
  //   } = await fetcher(insertUser, token)

  //   // Change the account's foreign key
  //   await fetcher(updateService, token, {
  //     serviceId: account.id,
  //     service: { user_id: userId },
  //   })

  //   // Refresh selected user and users list
  //   onDetachAccount(account)
  // }

  return (
    <animated.div ref={ref} style={styles} className="service">
      <h3>
        <div className="leftContainer">
          <div className="icon">
            <ServiceLogo name={account.type} />
          </div>
          <div className="title">{account.type}</div>
        </div>
        {!isSingleAccount && (
          <button
            title="détacher"
            className="secondary sm icon"
            // onClick={() => onDetachAccount(account)}
            onClick={() => {
              console.log("spring start")
              // spring.start()
              setDetached(true)
            }}
            // onClick={(_) => handleUnmergeButton(account)}
          >
            <i className="ri-eject-fill"></i>
          </button>
        )}
      </h3>
      {account.type === "github" && <GithubUserInfo account={account} />}
      {account.type === "matomo" && <InfoTable data={account.data} />}
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

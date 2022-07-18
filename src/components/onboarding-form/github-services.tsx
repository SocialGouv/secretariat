import useOnboarding from "@/hooks/use-onboarding"
import ServiceAccounts from "@/components/onboarding-form/services"

const GithubLogin = () => {
  const { data, mutate } = useOnboarding()

  return (
    <label htmlFor="githubLogin" className="col-span-2">
      Github login:&nbsp;&nbsp;
      <input
        type="text"
        id="githubLogin"
        name="githubLogin"
        value={data?.githubLogin}
        placeholder="BlackWarrior94"
        onChange={(e) =>
          mutate({
            ...data,
            githubLogin: e.target.value,
          })
        }
      />
    </label>
  )
}

const GithubServices = () => {
  const { data } = useOnboarding()

  const services = {
    github: !!data?.githubLogin,
    matomo: !!data?.githubLogin,
    nextcloud: !!data?.githubLogin,
    sentry: !!data?.githubLogin,
    zammad: !!data?.githubLogin,
  } as Ruru

  return (
    <div className="github-services">
      <div className="services">
        <h3>Services associés à Github:</h3>
        <br />
        <GithubLogin />
        <br />
        <br />
        <ServiceAccounts services={services} />
      </div>
    </div>
  )
}

export default GithubServices

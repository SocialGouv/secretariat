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
  } as OnboardingRequestServices

  return (
    <div className="card github-services">
      <div className="services">
        <h3>Services associés à Github:</h3>
        <p>
          Associez votre compte Github à{" "}
          <a
            target="_blank"
            href="https://github.com/socialgouv"
            rel="noreferrer"
          >
            l&apos;organisation SocialGouv de la Fabrique Numérique
          </a>
          .
        </p>
        <GithubLogin />
        <p>
          Une fois membre de l&apos;organisation SocialGouv, les services listés
          ci-dessous vous seront accessibles via une authentification Github.
        </p>
        <br />
        <ServiceAccounts services={services} />
      </div>
    </div>
  )
}

export default GithubServices

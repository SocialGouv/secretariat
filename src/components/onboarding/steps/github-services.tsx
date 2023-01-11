import useOnboarding from "@/hooks/use-onboarding"
import GithubLogin from "@/components/common/github-login"
import { useEffect } from "react"

const GithubServices = ({
  onValidate,
}: {
  onValidate: (isValid: boolean) => void
}) => {
  const { data, mutate } = useOnboarding()

  useEffect(() => onValidate(true), [onValidate])

  return (
    <div className="github-services">
      <p className="mb-6">
        Si vous le souhaitez, vous pouvez associer votre compte Github à{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/socialgouv"
        >
          l&apos;organisation SocialGouv de la Fabrique Numérique
        </a>{" "}
        et profiter de l&apos;authentification Github pour accéder à certains
        services de la Fabrique Numérique.
      </p>

      <GithubLogin
        login={data?.githubLogin}
        onChange={(login) => mutate({ ...data, githubLogin: login })}
      />

      <ul className="services-list">
        <li className={`service ${data?.githubLogin ? "selected" : ""}`}>
          <i className="ri-git-pull-request-line icon" />
          <p>
            Je souhaite obtenir un accès aux repositories de SocialGouv{" "}
            <i>(Github)</i>
          </p>
          <i className="ri-check-line check" />
        </li>
        <li className={`service ${data?.githubLogin ? "selected" : ""}`}>
          <i className="ri-line-chart-line icon" />
          <p>
            Je souhaite obtenir un accès au service de statistiques des produits{" "}
            <i>(Matomo)</i>
          </p>
          <i className="ri-check-line check" />
        </li>
        <li className={`service ${data?.githubLogin ? "selected" : ""}`}>
          <i className="ri-bug-line icon" />
          <p>
            Je souhaite obtenir un accès au service de remontée de bugs{" "}
            <i>(Sentry)</i>
          </p>
          <i className="ri-check-line check" />
        </li>
        <li className={`service ${data?.githubLogin ? "selected" : ""}`}>
          <i className="ri-folders-line icon" />
          <p>
            Je souhaite obtenir un accès au service de partage de documents{" "}
            <i>(NextCloud)</i>
          </p>
          <i className="ri-check-line check" />
        </li>
        <li className={`service ${data?.githubLogin ? "selected" : ""}`}>
          <i className="ri-customer-service-2-fill icon" />
          <p>
            Je souhaite obtenir un accès au service de support utilisateurs{" "}
            <i>(Paztek)</i>
          </p>
          <i className="ri-check-line check" />
        </li>
      </ul>
    </div>
  )
}

export default GithubServices

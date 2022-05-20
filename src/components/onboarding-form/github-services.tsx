import GithubLogin from "@/components/onboarding-form/github-login"

const GithubServices = ({
  githubLogin,
  onStatusChange,
}: {
  githubLogin: string
  onStatusChange: (service: ServiceName, checked: boolean) => void
}) => {
  const handleGithubLoginChange = (login: string) => {
    console.log("handleGithubLoginChange", login)
  }

  return (
    <div className="services">
      <h3>Services associés à Github:</h3>
      <GithubLogin login={githubLogin} onChange={handleGithubLoginChange} />
      {/* <ServiceAccounts
        onStatusChange={onStatusChange}
        services={["github", "matomo", "nextcloud", "sentry", "zammad"]}
      /> */}
    </div>
  )
}

export default GithubServices

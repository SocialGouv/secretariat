import DefaultServices from "./default-services"
// import GithubServices from "./github-services"
import UserInfo from "./user-info"

const Form = ({
  status,
  onSubmit,
}: {
  status: "create" | "review"
  onSubmit: () => void
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault()
      onSubmit()
    }}
  >
    <UserInfo />
    {/* <hr /> */}
    <DefaultServices />
    {/* <hr /> */}
    {/* <GithubServices
    // githubLogin={data.githubLogin}
    // onStatusChange={handleServiceAccountStatusChange}
    /> */}

    <button className="primary" type="submit">
      {status === "create" ? "Envoyer" : "Valider"}
    </button>
  </form>
)

export default Form

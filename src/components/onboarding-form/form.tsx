import UserInfo from "./user-info"
import GithubServices from "./github-services"
import DefaultServices from "./default-services"

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
    <DefaultServices />
    <GithubServices />

    <button className="primary" type="submit">
      {status === "create" ? "Envoyer" : "Valider"}
    </button>
  </form>
)

export default Form

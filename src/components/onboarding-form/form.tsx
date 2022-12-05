import Alert from "@/components/common/alert"

import UserInfo from "./user-info"
import GithubServices from "./github-services"
import DefaultServices from "./default-services"
import { useMemo } from "react"

const Form = ({
  status,
  review,
  onSubmit,
}: {
  review?: { author: string; date: string }
  status: "create" | "review" | "reviewed"
  onSubmit: () => void
}) => {
  const reviewDate = useMemo(() => {
    if (!review) return null
    const reviewDate = new Date(review.date)
    return reviewDate.toLocaleString("fr-FR")
  }, [review])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <UserInfo />
      <DefaultServices />
      <GithubServices />

      {status === "reviewed" ? (
        <Alert
          type="info"
          title="Demande validée"
          message={`Cette demande d'embarquement a été validée${
            review?.author && ` par ${review.author} le ${reviewDate}`
          }.`}
        />
      ) : (
        <button className="primary" type="submit">
          {status === "create" ? "Envoyer" : "Valider"}
        </button>
      )}
    </form>
  )
}

export default Form

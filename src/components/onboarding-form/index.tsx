import { useEffect, useState } from "react"

import Alert from "@/components/common/alert"
import useOnboarding from "@/hooks/use-onboarding"
import Form from "@/components/onboarding-form/form"
import statusOk from "@/utils/status-ok"
import graphQLFetcher from "@/utils/graphql-fetcher"
import {
  onboardingRequestAction,
  onboardingReviewAction,
} from "@/queries/index"

type ServicesAccountsStatuses = Record<
  ServiceName,
  { status: number; body: string | Record<"message", string> }
>

const ServicesAccountsStatuses = ({
  statuses,
}: {
  statuses?: ServicesAccountsStatuses
}) => (
  <div className="servicesAccountsStatuses">
    {statuses &&
      Object.entries(statuses).map(([service, status], i) => (
        <Alert
          key={i}
          type={statusOk(status.status) ? "success" : "error"}
          title={service}
          message={
            typeof status.body === "string" ? status.body : status.body.message
          }
        />
      ))}
  </div>
)

const OnboardingForm = () => {
  const { data, request, id } = useOnboarding()
  const [status, setStatus] = useState<
    | "create"
    | "review"
    | "create_success"
    | "create_error"
    | "create_already_exists"
    | "review_success"
    | "review_error"
  >("create")

  const [servicesAccountsStatuses, setServicesAccountsStatuses] =
    useState<ServicesAccountsStatuses>()

  const handleCreationSubmit = async () => {
    const {
      onboardingRequestAction: { status, body },
    } = await graphQLFetcher({
      query: onboardingRequestAction,
      includeCookie: true,
      parameters: { data },
    })

    if (statusOk(status)) {
      setStatus("create_success")
    } else if (body === "already exists") {
      setStatus("create_already_exists")
    } else {
      setStatus("create_error")
    }
  }

  const handleReviewSubmit = async () => {
    const { onboardingReviewAction: responses } = await graphQLFetcher({
      query: onboardingReviewAction,
      includeCookie: true,
      parameters: { data, id },
    })
    setStatus("review_success")
    setServicesAccountsStatuses(responses)
  }

  useEffect(() => {
    if (request) setStatus("review")
  }, [request])

  return (
    <div className="onboarding-form mx-12">
      {status === "review" && (
        <Form status="review" onSubmit={handleReviewSubmit} />
      )}
      {status === "create" && (
        <Form status="create" onSubmit={handleCreationSubmit} />
      )}
      {status === "create_success" && (
        <div className="mt-12">
          <Alert
            type="success"
            message="Un email de confirmation vient de vous être envoyé."
          />
        </div>
      )}
      {status === "review_success" && (
        <div className="mt-12">
          <Alert
            type="info"
            message="Un email a été envoyé à l'émetteur de la requête d'embarquement."
          />
          <ServicesAccountsStatuses statuses={servicesAccountsStatuses} />
        </div>
      )}
      {status === "create_error" && (
        <div className="mt-12">
          <Alert
            type="error"
            message="Une erreur est survenue veuillez réessayer ultérieurement."
          />
        </div>
      )}
      {status === "create_already_exists" && (
        <div className="mt-12">
          <Alert
            type="warning"
            message="Une demande d'embarquement utilisant cet email existe déjà."
          />
        </div>
      )}
    </div>
  )
}

export default OnboardingForm

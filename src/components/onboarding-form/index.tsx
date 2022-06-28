import { useEffect, useState } from "react"

import fetcher from "@/utils/rest-fetcher"
import Alert from "@/components/common/alert"
import useOnboarding from "@/hooks/use-onboarding"
import Form from "@/components/onboarding-form/form"
import statusOk from "@/utils/status-ok"

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
  const { data, request } = useOnboarding()
  const [status, setStatus] = useState<
    | "create"
    | "review"
    | "create_success"
    | "create_error"
    | "review_success"
    | "review_error"
  >("create")

  const [servicesAccountsStatuses, setServicesAccountsStatuses] =
    useState<ServicesAccountsStatuses>()

  const handleCreationSubmit = async () => {
    const result = await fetcher("/api/onboarding/request", {
      method: "POST",
      body: JSON.stringify({ ...request, data }),
      headers: { "content-type": "application/json" },
    })

    if (!result || !result.ok) setStatus("create_error")
    else if (result.ok) setStatus("create_success")
  }

  const handleReviewSubmit = async () => {
    const result = await fetcher("/api/onboarding/review", {
      method: "POST",
      body: JSON.stringify({ ...request, data }),
      headers: { "content-type": "application/json" },
    })

    if (!result || !result.ok) {
      setStatus("review_error")
    } else if (result.ok) {
      const data = await result.json()

      setStatus("review_success")
      setServicesAccountsStatuses(data)
    }
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
    </div>
  )
}

export default OnboardingForm

import { useEffect, useState } from "react"

import fetcher from "@/utils/rest-fetcher"
import Alert from "@/components/common/alert"
import useOnboarding from "@/hooks/use-onboarding"
import Form from "@/components/onboarding-form/form"

const ServicesAccountsStatuses = ({
  data,
}: {
  data: Record<string, unknown>
}) => {
  console.log("data", data)
  return (
    <div className="servicesAccountsStatuses">
      {Object.entries(data).map(
        ([service, item], i) =>
          console.log("service-item", service, item) || (
            <>
              <br />
              <Alert
                type="error"
                title={service}
                message={item.body.message || item.body}
              />
            </>
          )
      )}
    </div>
  )
}

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

  const [servicesAccountsStatuses, setServicesAccountsStatuses] = useState<
    Record<string, unknown>
  >({})

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

  console.log("STATUS", status, request)
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
            message="Un email a été envoyé à l'éméteur de la requête d'embarquement."
          />
          <ServicesAccountsStatuses data={servicesAccountsStatuses} />
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

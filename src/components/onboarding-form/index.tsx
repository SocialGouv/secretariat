import { useState } from "react"

import Alert from "@/components/common/alert"
import Form from "@/components/onboarding-form/form"

import fetcher from "@/utils/rest-fetcher"
import useOnboarding from "@/hooks/use-onboarding"

const OnboardingForm = () => {
  const { data } = useOnboarding()
  const [status, setStatus] = useState<"edit" | "success" | "error" | "valid">(
    "edit"
  )

  const handleSubmit = async () => {
    const result = await fetcher("/api/onboarding/request", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    })

    if (!result || !result.ok) setStatus("error")
    else if (result.ok) setStatus("success")
  }

  return (
    <div className="onboarding-form mx-12">
      {status === "edit" && <Form status="edit" onSubmit={handleSubmit} />}
      {status === "success" && (
        <div className="mt-12">
          <Alert
            type="success"
            message="Un email de confirmation vient de vous être envoyé."
          />
        </div>
      )}
      {status === "valid" && (
        <div className="mt-12">
          <Alert
            type="success"
            message="Un email a été envoyé à l'éméteur de la requête d'embarquement."
          />
        </div>
      )}
      {status === "error" && (
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

import { useEffect, useMemo, useState } from "react"

import statusOk from "@/utils/status-ok"
import Alert from "@/components/common/alert"
import Wizard from "@/components/common/wizard"
import useOnboarding from "@/hooks/use-onboarding"
import graphQLFetcher from "@/utils/graphql-fetcher"
import UserInfo from "@/components/onboarding/steps/user-info"
import GithubServices from "@/components/onboarding/steps/github-services"
import DefaultServices from "@/components/onboarding/steps/default-services"
import ServicesAccountsStatuses from "@/components/onboarding/steps/services-accounts-statuses"
import {
  onboardingRequestAction,
  onboardingReviewAction,
} from "@/queries/index"

const Onboarding = () => {
  const { data, request, id } = useOnboarding()
  const [status, setStatus] = useState<
    "create" | "review" | "reviewed" | "create_success" | "review_success"
  >("create")

  const [statusMessage, setStatusMessage] = useState<
    "create_error" | "create_already_exists" | undefined
  >()

  const [servicesAccountsStatuses, setServicesAccountsStatuses] =
    useState<ServicesAccountsStatuses>()

  const handleCreationSubmit = async () => {
    const {
      onboardingRequestAction: { status, body },
    } = await graphQLFetcher({
      includeCookie: true,
      parameters: { data },
      query: onboardingRequestAction,
    })

    if (statusOk(status)) {
      setStatus("create_success")
      setStatusMessage(undefined)
    } else if (body === "already exists") {
      setStatusMessage("create_already_exists")
    } else {
      setStatusMessage("create_error")
    }
  }

  const handleReviewSubmit = async () => {
    const { onboardingReviewAction: responses } = await graphQLFetcher({
      includeCookie: true,
      parameters: { data, id },
      query: onboardingReviewAction,
    })
    setStatus("review_success")
    setServicesAccountsStatuses(responses)
  }

  const handleComplete = () => {
    if (status === "review") {
      handleReviewSubmit()
    } else if (status === "create") {
      handleCreationSubmit()
    }
  }

  useEffect(() => {
    if (request) {
      if (request.reviewed) setStatus("reviewed")
      else setStatus("review")
    }
  }, [request])

  const steps = [
    {
      component: UserInfo,
      title: "Informations Personnelles",
    },
    {
      component: DefaultServices,
      title: "Services de la Fabrique Numérique",
    },
    {
      component: GithubServices,
      title: "Services associés à Github",
    },
  ] as WizardStep[]

  const reviewDate = useMemo(() => {
    if (!request?.reviewed) return null
    const reviewDate = new Date(request.reviewed.date)
    return reviewDate.toLocaleString("fr-FR")
  }, [request?.reviewed])

  return (
    <div className="onboarding mx-8">
      {status === "reviewed" && (
        <Alert
          type="info"
          title="Demande validée"
          message={`Cette demande d'embarquement a été validée${
            request.reviewed?.author &&
            ` par ${request.reviewed.author} le ${reviewDate}`
          }.`}
        />
      )}

      {status !== "create_success" && status !== "review_success" && (
        <Wizard
          data={data}
          steps={steps}
          onComplete={handleComplete}
          editable={status !== "reviewed"}
        />
      )}

      {status === "create_success" && (
        <Alert
          type="success"
          title="Demande d'embarquement effectuée"
          message="Un email de confirmation vient de vous être envoyé. Veuillez suivre le lien présent dans l'email afin de continuer votre embarquement."
        />
      )}

      {status === "review_success" && (
        <>
          <Alert
            type="info"
            title="Demande d'embarquement validée"
            message="Un email récapitulatif a été envoyé à l'émetteur de la requête d'embarquement."
          />
          <ServicesAccountsStatuses statuses={servicesAccountsStatuses} />
        </>
      )}

      {statusMessage === "create_error" && (
        <Alert
          type="error"
          message="Une erreur est survenue veuillez réessayer ultérieurement."
        />
      )}

      {statusMessage === "create_already_exists" && (
        <Alert
          type="warning"
          message="Une demande d'embarquement utilisant cet email existe déjà."
        />
      )}
    </div>
  )
}

export default Onboarding

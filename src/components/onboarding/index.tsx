import Image from "next/image"
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
    <div className="onboarding">
      {status === "reviewed" && (
        <Alert type="info" title="Demande validée">
          <>
            Cette demande d&apos;embarquement a été validée{" "}
            {request.reviewed?.author &&
              ` par ${request.reviewed.author} le ${reviewDate}`}
            .
          </>
        </Alert>
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
        <div className="flex flex-col flex-1 gap-12">
          <Alert type="success" title="Demande d'embarquement effectuée">
            <>
              Un <strong>email de confirmation</strong> vient de vous être
              envoyé. Veuillez{" "}
              <strong>suivre le lien présent dans l&apos;email</strong> afin de
              continuer votre embarquement.
            </>
          </Alert>
          <div className="flex-1 relative flex justify-center">
            <Image
              priority
              width={674}
              height={636}
              src="/images/email-sent.png"
              alt="illustration email envoyé"
            />
          </div>
        </div>
      )}

      {status === "review_success" && (
        <>
          <Alert type="info" title="Demande d'embarquement validée">
            <>
              Un email récapitulatif a été envoyé à l&apos;émetteur de la
              requête d&apos;embarquement.
            </>
          </Alert>
          <ServicesAccountsStatuses statuses={servicesAccountsStatuses} />
        </>
      )}

      {statusMessage === "create_error" && (
        <Alert type="error">
          <>Une erreur est survenue veuillez réessayer ultérieurement.</>
        </Alert>
      )}

      {statusMessage === "create_already_exists" && (
        <Alert type="warning">
          <>Une demande d&apos;embarquement utilisant cet email existe déjà.</>
        </Alert>
      )}
    </div>
  )
}

export default Onboarding

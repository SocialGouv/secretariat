import Alert from "@/components/common/alert"
import useOnboarding from "@/hooks/use-onboarding"
import { useEffect } from "react"

const DefaultServices = ({
  onValidate,
}: {
  onValidate: (isValid: boolean) => void
}) => {
  const { data, mutate } = useOnboarding()
  const { services } = data || {}

  useEffect(() => onValidate(true), [onValidate])

  return (
    <div className="default-services">
      <p>Sélectionnez les services qui vous intéressent :</p>
      <ul className="services-list editable">
        <li
          onClick={() =>
            mutate({
              ...data,
              services: { ...services, mattermost: !services?.mattermost },
            })
          }
          className={`service ${services?.mattermost ? "selected" : ""}`}
        >
          <i className="ri-wechat-line icon" />
          <p>
            Je souhaite obtenir un compte de messagerie instantanée{" "}
            <i>(Mattermost)</i>
          </p>
          <i className="ri-check-line check" />
        </li>
        <li
          onClick={() =>
            mutate({
              ...data,
              services: { ...services, ovh: !services?.ovh },
            })
          }
          className={`service ${services?.ovh ? "selected" : ""}`}
        >
          <i className="ri-mail-line icon" />
          <p>
            Je souhaite obtenir un compte email <b>@fabrique.social.gouv.fr</b>{" "}
            <i>(OVH)</i>
          </p>
          <i className="ri-check-line check" />
        </li>
      </ul>
      <Alert type="info" title="Information">
        <>
          Des comptes dédiés seront créés pour vous. Les informations de
          connexion vous seront envoyées par email ultérieurement.
        </>
      </Alert>
    </div>
  )
}

export default DefaultServices

import Alert from "@/components/common/alert"

const UserWarning = ({ type }: { type: Warning }) => (
  <div className="user-warning">
    {type === "alone_service" && (
      <Alert type="warning">
        <>Cet utilisateur n&apos;est attaché qu&apos;à un seul service.</>
      </Alert>
    )}
    {type === "missing_services" && (
      <Alert type="warning">
        <>Cet utilisateur n&apos;a pas de compte Github ou Mattermost.</>
      </Alert>
    )}
    {type === "no_departure_date" && (
      <Alert type="warning">
        <>Cet utilisateur n&apos;a pas de date de départ.</>
      </Alert>
    )}
  </div>
)

export default UserWarning

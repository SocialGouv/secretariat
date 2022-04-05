import Alert from "@/components/common/alert"

const UserWarning = ({ type }: { type: Warning }) => (
  <div className="user-warning">
    {type === "alone_service" && (
      <Alert
        type="warning"
        message="Cet utilisateur n'est attaché qu'à un seul service."
      />
    )}
    {type === "missing_services" && (
      <Alert
        type="warning"
        message="Cet utilisateur n'a pas de compte Github ou Mattermost."
      />
    )}
    {type === "no_departure_date" && (
      <Alert
        type="warning"
        message="Cet utilisateur n'a pas de date de départ."
      />
    )}
  </div>
)

export default UserWarning

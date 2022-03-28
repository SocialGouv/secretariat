import Alert from "@/components/common/alert"

const UserWarning = ({ type }: { type?: string }) => (
  <div className="user-warning">
    {type === "alone_service" && (
      <Alert message="Cet utilisateur n'est constitué que d'un seul service." />
    )}
    {type === "missing_services" && (
      <Alert message="Cet utilisateur n'a pas de compte Github ou Mattermost." />
    )}
    {type === "missing_departure" && (
      <Alert message="Cet utilisateur n'a pas de date de départ." />
    )}
  </div>
)

export default UserWarning

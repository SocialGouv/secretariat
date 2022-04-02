import Alert from "@/components/common/alert"

const UserWarning = ({ type }: { type?: string }) => (
  <div className="user-warning">
    {type === "alone_service" && (
      <Alert message="Cet utilisateur n'est attaché qu'a un seul service." />
    )}
    {type === "missing_services" && (
      <Alert message="Cet utilisateur n'a pas de compte Github ou Mattermost." />
    )}
    {type === "no_departure_date" && (
      <Alert message="Cet utilisateur n'a pas de date de départ." />
    )}
  </div>
)

export default UserWarning

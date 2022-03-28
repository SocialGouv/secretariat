import Alert from "@/components/common/alert"

const UserWarning = ({ type }: { type?: string }) => (
  <div className="user-warning">
    {type === "alone_service" && (
      <Alert message="Cet utilisateur n'est constitué que d'un seul service." />
    )}
  </div>
)

export default UserWarning

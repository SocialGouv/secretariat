import Alert from "@/components/common/alert"

const UserWarning = ({ type }: { type?: string }) => (
  <div className="user-warning">
    {type === "no_alone_services" && (
      <Alert message="Attention: cet utilisateur n'est attaché qu'à un seul service." />
    )}
  </div>
)

export default UserWarning

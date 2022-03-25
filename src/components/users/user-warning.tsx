import Alert from "@/components/common/alert"

const UserWarning = ({ type }: { type?: string }) => (
  <div className="user-warning">
    {type === "no_alone_services" && (
      <Alert message="Cet utilisateur n'a pas de compte Github ou Mattermost." />
    )}
  </div>
)

export default UserWarning

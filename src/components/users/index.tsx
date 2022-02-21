import Loader from "@/components/common/loader"

const Users = ({
  users,
  children,
}: {
  users?: MixedUser[]
  children: JSX.Element
}) => {
  return (
    <>
      {!users ? (
        <Loader size="lg" />
      ) : !users.length ? (
        <div className="no-users">
          <div className="callout">Aucun utilisateur pour le moment...</div>
        </div>
      ) : (
        <div className="users">{children}</div>
      )}
    </>
  )
}

export default Users

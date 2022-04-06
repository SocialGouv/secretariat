import { useDrop } from "react-dnd"
import isEqual from "lodash.isequal"
import UserHeader from "@/components/users/user-header"
import UserWarning from "@/components/users/user-warning"
import UserServices from "@/components/users/user-services"
import UserLastUpdate from "@/components/users/user-last-update"
import UserArrivalDeparture from "@/components/users/user-arrival-departure"

const UserProfile = ({
  user,
  onUserDrop,
  onUserEdit,
  onAccountsChanged,
}: {
  user: User
  onUserDrop: (user: User) => void
  onUserEdit: (user: User) => void
  onAccountsChanged: (user: User) => void
}) => {
  const handleDetachAccount = (detachedAccount: ServiceAccount) => {
    onAccountsChanged({
      ...user,
      services: user.services.filter(
        (account) => !isEqual(account, detachedAccount)
      ),
    })
  }

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "user",
      drop: (user: User) => {
        onUserDrop(user)
        return user
      },
      canDrop: (item) => item.id !== user.id,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [user]
  )

  const dropClass = canDrop ? (isOver ? "drop-over" : "drop-allowed") : ""

  return (
    <div ref={drop} role={"Profile"} className={`user-profile ${dropClass}`}>
      <div className="header">
        <UserHeader user={user} />
        <UserLastUpdate date={user.updated_at} />
      </div>
      <div className="content">
        {user.warnings.map((warning) => (
          <UserWarning key={warning} type={warning} />
        ))}
        <UserArrivalDeparture
          arrival={user.arrival}
          departure={user.departure}
          expired={
            !!(
              user.departure &&
              new Date(user.departure).getTime() < new Date().getTime()
            )
          }
          onChange={(dates) => onUserEdit({ ...user, ...dates })}
        />
        <UserServices
          services={user.services}
          onDetachAccount={handleDetachAccount}
        />
      </div>
    </div>
  )
}

export default UserProfile

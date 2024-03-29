import { useDrop } from "react-dnd"

import UserHeader from "@/components/users/user-header"
import UserWarning from "@/components/users/user-warning"
import UserServices from "@/components/users/user-services"
import UserLastUpdate from "@/components/users/user-last-update"
import UserArrivalDeparture from "@/components/users/user-arrival-departure"

const UserProfile = ({
  user,
  onUserDrop,
  onUserEdit,
  onAccountsChange,
  onToggleAccount,
}: {
  user: User
  onUserDrop: (user: User) => void
  onUserEdit: (user: User) => void
  onAccountsChange: (account: ServiceAccount) => void
  onToggleAccount: (account: AccountToToggle) => void
}) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "user",
      drop: (u: User) => {
        onUserDrop(u)
        return u
      },
      canDrop: (item) => item.id !== user.id,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [user]
  )

  const dropClass = isOver ? "drop-over" : "drop-allowed"

  return (
    <div
      ref={drop}
      role={"Profile"}
      className={`user-profile ${canDrop ? dropClass : ""}`}
    >
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
          user={user}
          onDetachAccount={onAccountsChange}
          onToggleAccount={onToggleAccount}
        />
      </div>
    </div>
  )
}

export default UserProfile

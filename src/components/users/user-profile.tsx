import { useDrop } from "react-dnd"

import UserServices from "@/components/users/user-services"
import UserArrivalDeparture from "./user-arrival-departure"
import UserLastUpdate from "./user-last-update"
import UserWarning from "./user-warning"
import UserHeader from "./user-header"

const UserProfile = ({
  user,
  onUserDrop,
  onUserEdit,
}: {
  user: User
  onUserDrop: (user: User) => void
  onUserEdit: (user: User) => void
}) => {
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
        {user.warning && <UserWarning type={user.warning} />}
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
        <UserServices services={user.services} />
      </div>
    </div>
  )
}

export default UserProfile

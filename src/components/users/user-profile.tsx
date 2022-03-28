import { useDrop } from "react-dnd"

import { haveSimilarServices } from "@/services/users"
import UserServices from "@/components/users/user-services"
import UserArrivalDeparture from "./user-arrival-departure"
import UserLastUpdate from "./user-last-update"
import UserWarning from "./user-warning"
import UserHeader from "./user-header"

const UserProfile = ({
  user,
  onUserDrop,
}: {
  user: User
  onUserDrop: (user: User) => User
}) => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: "user",
      drop: onUserDrop,
      canDrop: (item) => !haveSimilarServices(item, user),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [user]
  )

  const dropClass = canDrop ? (isOver ? "drop-over" : "drop-allowed") : ""

  return (
    <div className="selected-user">
      <div className="sticky-container">
        <div
          ref={drop}
          role={"Profile"}
          className={`user-profile ${dropClass}`}
        >
          <div className="header">
            <UserHeader user={user} />
            <UserLastUpdate date={user.updated_at} />
          </div>
          <UserArrivalDeparture user={user} />
          <UserWarning type={user.warning} />
          <UserServices user={user} />
        </div>
      </div>
    </div>
  )
}

export default UserProfile

import Image from "next/image"
import { useDrop } from "react-dnd"

import { haveSimilarServices } from "@/services/users"
import UserServices from "@/components/users/user-services"
import UserArrivalDeparture from "./user-arrival-departure"
import UserLastUpdate from "./user-last-update"

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

  const backgroundColor = canDrop
    ? isOver
      ? "#e8edff"
      : "#f4f6ff"
    : "transparent"

  return (
    <div className="selected-user">
      <div className="sticky-container">
        <div
          ref={drop}
          role={"Profile"}
          className="user-profile"
          style={{ backgroundColor }}
        >
          <div className="header">
            <Image
              width={48}
              height={48}
              alt="user avatar"
              src={user.avatarUrl || "/images/avatar.jpeg"}
            />
            <h2>{user.name}</h2>
            <UserLastUpdate date={user.updated_at} />
          </div>
          <UserArrivalDeparture user={user} />
          <UserServices user={user} />
        </div>
      </div>
    </div>
  )
}

export default UserProfile

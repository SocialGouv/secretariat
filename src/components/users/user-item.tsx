import { useDrag } from "react-dnd"

import UserTemplate from "@/components/users/user-template"

const UserItem = ({
  user,
  onClick,
  selected,
}: {
  user: User
  selected: boolean
  onClick: () => void
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "user",
    item: user,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  return (
    <li
      ref={drag}
      role="User"
      onClick={onClick}
      className={`tile${selected ? " selected" : ""}`}
    >
      <UserTemplate user={user} />
    </li>
  )
}

export default UserItem

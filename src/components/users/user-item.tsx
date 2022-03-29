import { useDrag } from "react-dnd"

import UserTemplate from "@/components/users/user-template"

const UserItem = ({
  user,
  onClick,
  dropped,
  selected,
  hasSimilarServices,
}: {
  user: User
  dropped: boolean
  selected: boolean
  onClick: () => void
  hasSimilarServices: boolean
}) => {
  const draggable = !selected && !hasSimilarServices

  const [{ isDragging }, drag] = useDrag(() => ({
    item: user,
    type: "user",
    canDrag: draggable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const classes = []
  if (selected) classes.push("selected")
  if (draggable) classes.push("draggable")
  if (isDragging || dropped) classes.push("dragging")

  return (
    <li
      role="User"
      ref={drag}
      onClick={onClick}
      className={`tile ${classes.join(" ")}`}
    >
      <div className="drag-handler"></div>
      <UserTemplate user={user} />
    </li>
  )
}

export default UserItem

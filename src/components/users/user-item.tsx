import { useDrag } from "react-dnd"

import UserTemplate from "@/components/users/user-template"

const UserItem = ({
  user,
  onClick,
  dropped,
  selected,
}: {
  user: User
  dropped: boolean
  selected: boolean
  onClick: () => void
}) => {
  const [{ isDragging, canDrag }, drag] = useDrag(() => ({
    type: "user",
    item: user,
    // options: {
    //   dropEffect: "move",
    // },
    // end: (user: User, monitor) => {
    //   console.log("user", user, monitor.didDrop())
    //   drag.
    // },
    canDrag: () => !selected,
    collect: (monitor) => ({
      // didDrop: monitor.didDrop(),
      canDrag: monitor.canDrag(),
      isDragging: monitor.isDragging(),
      // handlerId: monitor.getHandlerId(),
    }),
  }))

  const classes = []
  if (selected) classes.push("selected")
  if (canDrag) classes.push("draggable")
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

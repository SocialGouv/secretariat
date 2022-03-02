import { useDrag } from "react-dnd"

import UserTemplate from "@/components/common/user-template"

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
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<User>()
      if (item && dropResult) {
        // console.log("Dopped Item, USER", item)
        // alert(`You dropped ${item.name} into ${dropResult.name}!`)
      }
    },
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

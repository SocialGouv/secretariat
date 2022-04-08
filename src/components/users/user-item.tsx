import { useDrag } from "react-dnd"
import { useSpring, animated } from "react-spring"
import { useCallback, useEffect, useRef, useState } from "react"

import useSelectedUser from "@/hooks/use-selected-user"
import UserTemplate from "@/components/users/user-template"

const UserItem = ({
  user,
  onClick,
  dropped,
  onRemove,
}: {
  user: User
  dropped: boolean
  onClick: () => void
  onRemove: () => void
}) => {
  const ref = useRef(null)
  const { selectedUser } = useSelectedUser()
  const [selected, setSelected] = useState(false)
  const [styles, spring] = useSpring(() => ({}))

  useEffect(() => {
    if (user && selectedUser) setSelected(selectedUser.id === user.id)
  }, [user, selectedUser])

  const onRemoveCallback = useCallback(onRemove, [onRemove])

  useEffect(() => {
    if (ref && ref.current) {
      const el = ref.current as HTMLElement
      spring.update({
        config: { duration: 200 },
        to: [{ opacity: 0 }, { height: 0 }],
        from: { opacity: 1, height: el.offsetHeight },
        onRest: () => el.offsetHeight === 0 && onRemoveCallback(),
      })
    }
  }, [ref, spring, onRemoveCallback])

  useEffect(() => {
    if (dropped) spring.start()
  }, [dropped, spring])

  const [{ isDragging }, drag] = useDrag(
    () => ({
      item: user,
      type: "user",
      canDrag: !selected,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [user, selected]
  )

  const classes = []
  if (selected) classes.push("selected")
  if (!selected) classes.push("draggable")
  if (isDragging || dropped) classes.push("dragging")

  return (
    <animated.li
      ref={ref}
      role="User"
      style={styles}
      onClick={onClick}
      className="user-item"
    >
      <div className={`user box ${classes.join(" ")}`} ref={drag}>
        <div className="drag-handler"></div>
        <UserTemplate user={user} />
      </div>
    </animated.li>
  )
}

export default UserItem

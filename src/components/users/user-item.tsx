import { useDrag } from "react-dnd"
import { useSpring, animated } from "react-spring"

import UserTemplate from "@/components/users/user-template"
import { useCallback, useEffect, useRef } from "react"

const UserItem = ({
  user,
  onClick,
  dropped,
  selected,
  onRemove,
}: {
  user: User
  dropped: boolean
  selected: boolean
  onClick: () => void
  onRemove: () => void
}) => {
  const ref = useRef(null)
  const [styles, spring] = useSpring(() => ({}))

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

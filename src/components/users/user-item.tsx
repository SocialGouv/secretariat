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

  const del = useCallback(onRemove, [onRemove])

  useEffect(() => {
    if (ref && ref.current) {
      // console.log("USE EFFECT 1")
      const el = ref.current as HTMLElement
      spring.update({
        onRest: () => {
          if (!el.clientHeight) {
            console.log("--> STOP ANIMATION")
            // el.remove()
            del()
          }
        },
        config: { duration: 200 },
        to: [{ opacity: 0 }, { height: 0 }],
        from: { opacity: 1, height: el.offsetHeight },
      })
    }
  }, [ref, spring, del])

  useEffect(() => {
    if (dropped) {
      console.log("--> START ANIMATION")
      spring.start()
    }
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
      <div className={`user ${classes.join(" ")}`} ref={drag}>
        <div className="drag-handler"></div>
        <UserTemplate user={user} />
      </div>
    </animated.li>
  )
}

export default UserItem

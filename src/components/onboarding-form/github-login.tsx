import debounceFn from "debounce-fn"
import { useEffect, useRef, useState } from "react"

const GithubLogin = ({
  login,
  onChange,
}: {
  login: string
  onChange: (login: string) => void
}) => {
  const [value, setValue] = useState<string>(login)
  const debounced = useRef(debounceFn(onChange, { wait: 500 }))

  useEffect(() => debounced.current(value), [value])

  return (
    <label htmlFor="#message" className="col-span-4">
      Identifiant Github:
      <input
        type="text"
        id="githubLogin"
        name="githubLogin"
        value={value}
        onChange={(e) => {
          const {
            target: { name, value },
          } = e
          setValue(value)
          // setData({ ...data, [name]: value })
          console.log("onChange", name, value)
        }}
      />
    </label>
  )
}

export default GithubLogin

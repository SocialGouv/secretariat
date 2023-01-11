import Image from "next/image"
import pDebounce from "p-debounce"
import { searchGithubUsers } from "@/queries/index"
import graphQLFetcher from "@/utils/graphql-fetcher"
import { useCallback, useEffect, useRef, useState } from "react"

import Loader from "@/components/common/loader"

interface User {
  name: string
  login: string
  avatarUrl: string
}

const Status = ({ status }: { status: "loading" | "success" | undefined }) => (
  <div className="github-login-status">
    {status === "loading" && <Loader size="sm" />}
    {status === "success" && (
      <i className="ri-check-line ri-2x text-green-600" />
    )}
    {!status && (
      <i className="ri-search-line text-2xl leading-6 text-blue-france-113-main" />
    )}
  </div>
)

const GithubLogin = ({
  login = "",
  onChange,
}: {
  login?: string
  onChange: (login: string | undefined) => void
}) => {
  const [users, setUsers] = useState<User[]>()
  const [value, setValue] = useState<string>(login)
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<User | undefined>(
    login ? ({ login } as User) : undefined
  )

  const findUser = async (query: string) => {
    setLoading(true)
    const payload = {
      includeCookie: true,
      parameters: { query },
      query: searchGithubUsers,
    }
    const {
      search: { nodes },
    } = await graphQLFetcher(payload)

    const users = nodes.filter((node: User) => node.login)

    setUsers(users)
    setLoading(false)
  }

  const debounced = useRef(pDebounce(findUser, 500))

  const handleClick = (user: User) => {
    setUser(user)
    setValue(user.login)
  }

  const onValueChange = useCallback(
    (value: string | undefined) => {
      if ((login && value !== login) || !value?.length) {
        setUser(undefined)
      }
      if (value && login !== value) {
        const findUser = async () => await debounced.current(value)
        findUser()
      }
    },
    [login]
  )

  useEffect(() => onValueChange(value), [value, onValueChange])

  useEffect(() => {
    onChange(user?.login || "")
  }, [user, onChange])

  return (
    <div className="github-login">
      <input
        type="text"
        value={value}
        id="githubLogin"
        name="githubLogin"
        placeholder="Cherchez votre login Github..."
        onChange={({ target: { value } }) => setValue(value)}
      />
      <Status status={loading ? "loading" : user ? "success" : undefined} />
      {!user && value && (
        <ul>
          {users?.map((user, i) => (
            <li key={i} onClick={() => handleClick(user)}>
              <Image
                width={24}
                height={24}
                alt="user avatar"
                src={user.avatarUrl}
              />
              <span>{user.login}</span>
              {user.name && (
                <span className="text-xs font-bold">({user.name})</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GithubLogin

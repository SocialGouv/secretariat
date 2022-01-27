import Link from "next/link"
import { useRouter } from "next/router"

const Users = ({ users = [] }: { users: GithubUser[] }) => {
  const { query } = useRouter()

  return (
    <ul className="users">
      {users.map(({ name }, i) => (
        <li key={i}>
          <a>{name}</a>
        </li>
      ))}
    </ul>
  )
}

export default Users

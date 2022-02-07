import { useRouter } from "next/router"

const Users = ({ users = [] }: { users: MatomoUser[] }) => {
  const { query } = useRouter()

  return (
    <ul className="users">
      {users.map(({ email }, i) => (
        <li key={i}>
          <a>{email}</a>
        </li>
      ))}
    </ul>
  )
}

export default Users

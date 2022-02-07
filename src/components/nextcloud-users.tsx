import { useRouter } from "next/router"

const Users = ({ users = [] }: { users: NextCloudUser[] }) => {
  const { query } = useRouter()

  return (
    <ul className="users">
      {users.map(({ login }, i) => (
        <li key={i}>
          <a>{login}</a>
        </li>
      ))}
    </ul>
  )
}

export default Users

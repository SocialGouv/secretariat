const Users = ({ users = [] }: { users: GithubUser[] }) => (
  <ul className="users">
    {users.map(({ email, login }, i) => (
      <li key={i}>
        <a>
          {login} (email: {email})
        </a>
      </li>
    ))}
  </ul>
)

export default Users

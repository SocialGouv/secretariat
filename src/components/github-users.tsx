import Image from "next/image"
import { useState } from "react"

import Users from "@/components/users/index"
import useGithubUsers from "@/services/github"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const GithubUserProfile = ({ user }: { user: GithubUser }) => (
  <UserProfile>
    <div className="flex items-center mb-4">
      <Image width={48} height={48} alt="user avatar" src={user.avatarUrl} />
      <h2 className="ml-4">{user.name}</h2>
    </div>
    <h3>Github</h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
    </ul>
    <h3 className="mt-4">Matomo</h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
    </ul>
    <h3 className="mt-4">Sentry</h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
    </ul>
    <h3 className="mt-4">OVH</h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
    </ul>
    <h3 className="mt-4">Pastek</h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
    </ul>
    <h3 className="mt-4">Mattermost</h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
    </ul>
    <h3 className="mt-4">NextCloud</h3>
    <hr className="my-2" />
    <ul className="text-sm">
      <li>
        <strong>Login</strong>: {user.login}
      </li>
      <li>
        <strong>Email</strong>: {user.email}
      </li>
      <li>
        <strong>ID</strong>: {user.id}
      </li>
    </ul>
  </UserProfile>
)

const GithubUsers = () => {
  const users = useGithubUsers()
  const [selectedUser, setSelectedUser] = useState<GithubUser>()

  return (
    <Users users={users}>
      <>
        <UserList
          users={users}
          selectedUser={selectedUser}
          getUserData={(user) => user as User}
          onSelect={(user) => setSelectedUser(user as GithubUser)}
        />
        {selectedUser && <GithubUserProfile user={selectedUser} />}
      </>
    </Users>
  )
}

export default GithubUsers

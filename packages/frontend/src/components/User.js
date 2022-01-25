import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation, useLazyQuery } from '@apollo/client'

import ServicesStatus from 'components/ServicesStatus'

function User ({ user, updateUsersList }) {
  const [isActive, setisActive] = useState(false)

  const [deleteUser] = useMutation(gql`
    mutation DeleteUser($id: Int!) {
      delete_users_by_pk(id: $id) {
        id
      }
    }
  `)

  const [deleteGithubUserMutation] = useMutation(
    gql`
      mutation DeleteGithubUser($github_username: String!) {
        delete_github_user(github_username: $github_username) {
          status
          message
        }
      }
    `
  )

  const [deleteGithubUser] = useLazyQuery(
    gql`
      query GetGithubUsername($user_id: Int!) {
        github_usernames_by_pk(user_id: $user_id) {
          username
        }
      }
    `,
    {
      variables: { user_id: user.id },
      onCompleted: (data) => {
        deleteGithubUserMutation({
          variables: {
            github_username: data.github_usernames_by_pk.username
          },
          onCompleted: (data) => {
            console.log('Github user deleted successfully')
          }
        })
      }
    }
  )

  const handleDelete = (id) => {
    for (const service of user.user_services) {
      switch (service.service_name) {
        case 'github':
          // TODO maybe this call could fail if deleteUser() finished first ?
          deleteGithubUser()
          break
        default:
          console.error('Unknown service name', service.service_name)
      }
    }
    deleteUser({
      variables: { id: id },
      onCompleted: (data) => {
        console.log('User deleted successfully')
        updateUsersList()
      }
    })
  }

  return (
    <div
      className={
        'grid grid-cols-7 rounded-md p-2 ' +
        (isActive ? 'bg-blue-100' : 'even:bg-slate-100')
      }
    >
      <div
        onClick={(e) => setisActive(!isActive)}
        className="overflow-hidden text-ellipsis"
      >
        {user.firstname}
      </div>
      <div
        onClick={(e) => setisActive(!isActive)}
        className="overflow-hidden text-ellipsis"
      >
        {user.lastname}
      </div>
      <div
        onClick={(e) => setisActive(!isActive)}
        className="overflow-hidden text-ellipsis"
      >
        {user.email}
      </div>
      <div
        onClick={(e) => setisActive(!isActive)}
        className="overflow-hidden text-ellipsis"
      >
        {user.profile}
      </div>
      <div
        onClick={(e) => setisActive(!isActive)}
        className="overflow-hidden text-ellipsis"
      >
        {user.expiration}
      </div>
      <div
        onClick={(e) => setisActive(!isActive)}
        className="overflow-hidden text-ellipsis"
      >
        {user.user_teams.map((team) => (
          <div key={team.team_name}>{team.team_name}</div>
        ))}
      </div>
      <button
        className="font-normal rounded-md bg-slate-200 hover:bg-slate-300 px-4 py-1 w-min h-min"
        onClick={(_) => handleDelete(user.id)}
      >
        Supprimer
      </button>
      {isActive && <ServicesStatus user={user} />}
    </div>
  )
}

User.propTypes = {
  user: PropTypes.object,
  updateUsersList: PropTypes.func
}

export default User

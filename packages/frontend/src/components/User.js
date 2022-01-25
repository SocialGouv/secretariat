import React from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation, useLazyQuery } from '@apollo/client'

import ServicesStatus from 'components/ServicesStatus'

function User ({ user, isActive, setActiveUser, updateUsersList }) {
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

  const handleComponentClick = (event) => {
    if (event.target.id !== 'deleteButton') {
      if (isActive) {
        setActiveUser(null)
      } else {
        setActiveUser(user.id)
      }
    }
  }

  return (
    <div
      className={
        'grid grid-cols-7 p-2 ' +
        (isActive ? 'bg-blue-100' : 'even:bg-slate-100')
      }
      onClick={handleComponentClick}
    >
      <div className="overflow-hidden text-ellipsis">{user.firstname}</div>
      <div className="overflow-hidden text-ellipsis">{user.lastname}</div>
      <div className="overflow-hidden text-ellipsis">{user.email}</div>
      <div className="overflow-hidden text-ellipsis">{user.profile}</div>
      <div className="overflow-hidden text-ellipsis">{user.expiration}</div>
      <div className="overflow-hidden text-ellipsis">
        {user.user_teams.map((team) => (
          <div key={team.team_name}>{team.team_name}</div>
        ))}
      </div>
      <button
        id="deleteButton"
        className="font-normal rounded-md bg-slate-200 hover:bg-slate-300 px-4 py-1 w-min h-min"
        onClick={() => handleDelete(user.id)}
      >
        Supprimer
      </button>
      {isActive && <ServicesStatus user={user} />}
    </div>
  )
}

User.propTypes = {
  user: PropTypes.object,
  isActive: PropTypes.bool,
  setActiveUser: PropTypes.func,
  updateUsersList: PropTypes.func
}

export default User

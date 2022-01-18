import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'

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

  const handleDelete = (id) => {
    deleteUser({
      variables: { id: id },
      onCompleted: (data) => {
        console.log('User deleted successfully')
        updateUsersList()
      }
    })
  }

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}

User.propTypes = {
  user: PropTypes.object,
  updateUsersList: PropTypes.func
}

export default User

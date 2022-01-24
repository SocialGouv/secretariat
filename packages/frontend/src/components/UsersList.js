import React from 'react'
import PropTypes from 'prop-types'
import User from 'components/User'

function UsersList ({ users, updateUsersList }) {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-7 p-2">
        <div className="font-medium">Prénom</div>
        <div className="font-medium">Nom</div>
        <div className="font-medium">Email</div>
        <div className="font-medium">Profil</div>
        <div className="font-medium">Expiration</div>
        <div className="font-medium">Équipes</div>
        <div></div>
      </div>
      {users.map((user) => (
        <User user={user} key={user.id} updateUsersList={updateUsersList} />
      ))}
    </div>
  )
}

UsersList.propTypes = {
  users: PropTypes.array,
  updateUsersList: PropTypes.func
}

export default UsersList

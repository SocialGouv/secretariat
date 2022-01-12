import React from 'react'
import PropTypes from 'prop-types'
import User from 'components/User'

function UsersList ({ users, updateUsersList }) {
  return (
    <div className="grid grid-cols-7 gap-y-2">
      <div className="font-bold">Prénom</div>
      <div className="font-bold">Nom</div>
      <div className="font-bold">Email</div>
      <div className="font-bold">Profile</div>
      <div className="font-bold">Expiration</div>
      <div className="font-bold">Équipes</div>
      <div></div>
      {users.map((user) => (
        <User user={user} key={user.id} updateUsersList={updateUsersList} />
      ))}
    </div>
  )
}

UsersList.propTypes = {
  users: PropTypes.object,
  updateUsersList: PropTypes.func
}

export default UsersList

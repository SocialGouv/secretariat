import React, { useState } from 'react'
import PropTypes from 'prop-types'
import User from 'components/User'
import { useSearchParams } from 'react-router-dom'

function UsersList ({ users, updateUsersList }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeUser, setActiveUserState] = useState(
    parseInt(searchParams.get('activeUser'))
  )
  const setActiveUser = (user) => {
    if (user === null) {
      setSearchParams({})
    } else {
      setSearchParams({ activeUser: user })
    }
    setActiveUserState(user)
  }

  return (
    <div className="flex flex-col sm:mx-8">
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
        <User
          user={user}
          key={user.id}
          isActive={user.id === activeUser}
          setActiveUser={setActiveUser}
          updateUsersList={updateUsersList}
        />
      ))}
    </div>
  )
}

UsersList.propTypes = {
  users: PropTypes.array,
  updateUsersList: PropTypes.func
}

export default UsersList

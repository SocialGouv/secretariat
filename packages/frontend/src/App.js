import React, { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import UserCreationForm from 'components/UserCreationForm'
import UsersList from 'components/UsersList'
import { gql, useQuery } from '@apollo/client'

function App () {
  const [users, setUsers] = useState([])
  const { refetch: refetchUsers } = useQuery(
    gql`
      query getUsers {
        users {
          email
          id
          expiration
          firstname
          lastname
          profile
          user_teams {
            team_name
          }
          user_services {
            service_name
          }
        }
      }
    `,
    {
      onCompleted: (data) => {
        setUsers(data.users)
      },
      onError: (error) => console.log(error)
    }
  )
  const updateUsersList = () => {
    refetchUsers()
  }

  return (
    <div className="App text-center text-lg m-4">
      <nav className="mt-8 flex flex-row justify-evenly gap-x-2">
        <NavLink
          className={({ isActive }) => {
            return (
              'hover:bg-slate-200 px-8 py-3 ' +
              (isActive ? 'border-slate-400 border-b-2' : null)
            )
          }}
          to="/"
        >
          Liste des utilisateurs
        </NavLink>
        <NavLink
          className={({ isActive }) => {
            return (
              'hover:bg-slate-200 px-8 py-3 ' +
              (isActive ? 'border-slate-400 border-b-2' : null)
            )
          }}
          to="/add-user"
        >
          Ajouter un utilisateur
        </NavLink>
      </nav>
      <div className="mt-8">
        <Routes>
          <Route
            path="/"
            element={
              <UsersList users={users} updateUsersList={updateUsersList} />
            }
          />
          <Route
            path="/add-user"
            element={<UserCreationForm updateUsersList={updateUsersList} />}
          />
        </Routes>
      </div>
    </div>
  )
}

export default App

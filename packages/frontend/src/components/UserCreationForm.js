import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { gql, useQuery, useMutation } from '@apollo/client'

import TeamCreationForm from 'components/TeamCreationForm'

function UserCreationForm ({ updateUsersList }) {
  const initialValues = {
    firstname: '',
    lastname: '',
    email: '',
    profile: '',
    expiration: new Date(
      new Date().setMonth(new Date().getMonth() + 3)
    ).toLocaleDateString('en-CA'),
    teams: {},
    services: { github: false },
    githubUsername: ''
  }
  const [inputs, setInputs] = useState(initialValues)

  const navigate = useNavigate()

  const { refetch: refetchTeams } = useQuery(
    gql`
      query getTeams {
        teams {
          name
        }
      }
    `,
    {
      onCompleted: (data) => {
        const newTeams = data.teams.reduce((result, team) => {
          result[team.name] = inputs.teams[team.name] ?? false
          return result
        }, {})
        setInputs((values) => {
          return { ...values, teams: newTeams }
        })
      }
    }
  )

  const [insertUser] = useMutation(gql`
    mutation InsertUser(
      $firstname: String
      $lastname: String
      $email: String
      $profile: String
      $expiration: date
    ) {
      insert_users_one(
        object: {
          firstname: $firstname
          lastname: $lastname
          email: $email
          profile: $profile
          expiration: $expiration
        }
      ) {
        id
      }
    }
  `)

  const [insertUserTeam] = useMutation(gql`
    mutation InsertUserTeam($objects: [user_team_insert_input!] = {}) {
      insert_user_team(objects: $objects) {
        returning {
          id
        }
      }
    }
  `)

  const [insertUserService] = useMutation(gql`
    mutation InsertUserService($objects: [user_service_insert_input!] = {}) {
      insert_user_service(objects: $objects) {
        returning {
          id
        }
      }
    }
  `)

  const [registerGithubUser] = useMutation(gql`
    mutation RegisterGithubUser($github_username: String!) {
      register_github_user(github_username: $github_username) {
        status
        message
      }
    }
  `)

  const [insertGithubUsername] = useMutation(gql`
    mutation InsertGithubUsername($user_id: Int, $username: String) {
      insert_github_usernames_one(
        object: { user_id: $user_id, username: $username }
      ) {
        username
      }
    }
  `)

  const handleTextChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({
      ...values,
      [name]: value
    }))
  }

  const handleTeamsChange = (event) => {
    const teamName = event.target.name
    const value = event.target.checked
    setInputs((values) => ({
      ...values,
      teams: { ...values.teams, [teamName]: value }
    }))
  }

  const handleServicesChange = (event) => {
    setInputs((values) => ({
      ...values,
      services: {
        ...values.services,
        [event.target.name]: event.target.checked
      }
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    insertUser({
      variables: {
        firstname: inputs.firstname,
        lastname: inputs.lastname,
        email: inputs.email,
        profile: inputs.profile,
        expiration: inputs.expiration
      },
      onCompleted: (insertUserData) => {
        console.log('User added successfully')
        const teamsToInsert = Object.keys(inputs.teams).filter(
          (team) => inputs.teams[team]
        )
        insertUserTeam({
          variables: {
            objects: Array.from(teamsToInsert, (team) => ({
              team_name: team,
              user_id: insertUserData.insert_users_one.id
            }))
          },
          onCompleted: () => {
            console.log("User's teams added successfully")
            const servicesToInsert = Object.keys(inputs.services).filter(
              (service) => inputs.services[service]
            )
            insertUserService({
              variables: {
                objects: Array.from(servicesToInsert, (service) => ({
                  service_name: service,
                  user_id: insertUserData.insert_users_one.id
                }))
              },
              onCompleted: () => {
                if (inputs.services.github) {
                  registerGithubUser({
                    variables: {
                      github_username: inputs.githubUsername
                    },
                    onCompleted: (data) => {
                      insertGithubUsername({
                        variables: {
                          user_id: insertUserData.insert_users_one.id,
                          username: inputs.githubUsername
                        },
                        onCompleted: () => {
                          console.log('Github username added successfully')
                          updateUsersList()
                          navigate('/')
                        },
                        onError: (error) => {
                          console.error(error)
                        }
                      })
                    },
                    onError: (error) => {
                      console.log(error)
                    }
                  })
                } else {
                  updateUsersList()
                  navigate('/')
                }
              }
            })
          }
        })
      }
    })
  }

  return (
    <form
      className="flex flex-col gap-y-4 items-center"
      onSubmit={handleSubmit}
    >
      <input
        className="p-2 border-2 rounded-md"
        type="text"
        name="firstname"
        value={inputs.firstname}
        onChange={handleTextChange}
        placeholder="Prénom"
      />
      <input
        className="p-2 border-2 rounded-md"
        type="text"
        name="lastname"
        value={inputs.lastname}
        onChange={handleTextChange}
        placeholder="Nom"
      />
      <input
        className="p-2 border-2 rounded-md"
        type="text"
        name="email"
        value={inputs.email}
        onChange={handleTextChange}
        placeholder="Email"
      />
      <select
        className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 cursor-pointer"
        name="profile"
        value={inputs.profile}
        onChange={handleTextChange}
      >
        <option value="" disabled>
          Profil
        </option>
        <option value="dev">Dev</option>
        <option value="product">Produit</option>
      </select>
      <label className="font-medium">
        Date d&apos;expiration :
        <input
          className="ml-2 p-2 rounded-md bg-slate-200 hover:bg-slate-300 cursor-pointer"
          type="date"
          name="expiration"
          value={inputs.expiration}
          onChange={handleTextChange}
        />
      </label>
      <div className="flex flex-col gap-y-0">
        <span className="font-medium">Équipes :</span>
        <div className="flex flex-col gap-y-0 items-start">
          {Object.keys(inputs.teams).map((team) => (
            <label key={team}>
              <input
                className="mr-2"
                name={team}
                key={team}
                type="checkbox"
                checked={inputs.teams[team]}
                onChange={handleTeamsChange}
              />
              {team}
            </label>
          ))}
        </div>
      </div>

      {/* User may create a new team while creating a new user */}
      <TeamCreationForm updateTeamsList={refetchTeams} />
      <div className="mt-4 flex flex-col gap-y-2">
        <span className="font-medium text-4xl">Services</span>
        <div className="flex flex-col">
          <label>
            <input
              className="mr-2"
              name="github"
              checked={inputs.services.github}
              onChange={handleServicesChange}
              type="checkbox"
            />
            Github
          </label>
          <input
            name="githubUsername"
            value={inputs.githubUsername}
            onChange={handleTextChange}
            disabled={!inputs.services.github}
            className="p-2 border-2 rounded-md disabled:bg-slate-200 disabled:text-slate-500"
            type="text"
            placeholder="Nom d'utilisateur Github"
          />
        </div>
      </div>
      <input
        className="rounded-md bg-slate-200 px-4 py-2 hover:bg-slate-300 cursor-pointer"
        type="submit"
      />
    </form>
  )
}

UserCreationForm.propTypes = {
  updateUsersList: PropTypes.func
}

export default UserCreationForm

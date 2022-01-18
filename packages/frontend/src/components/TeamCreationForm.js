import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { gql, useMutation } from '@apollo/client'

function TeamCreationForm ({ updateTeamsList }) {
  const [teamNameInput, setTeamNameInput] = useState('')

  const [insertTeam] = useMutation(gql`
    mutation InsertTeam($name: String) {
      insert_teams_one(object: { name: $name }) {
        name
      }
    }
  `)

  const handleChange = (event) => {
    setTeamNameInput(event.target.value)
  }

  // Prevent Enter key to submit AddUserForm
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }

  // Submit TeamCreationForm
  const handleSubmit = () => {
    insertTeam({
      variables: { name: teamNameInput },
      onCompleted: (_) => {
        console.log('Team added successfully')
        updateTeamsList()
        setTeamNameInput('')
      }
    })
  }

  return (
    <div>
      <input
        className="p-2 border-2 rounded-md"
        type="text"
        name="teamName"
        value={teamNameInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Nouvelle équipe"
      />
      <input
        className="mt-2 ml-2 font-medium rounded-md bg-slate-200 px-4 py-2 hover:bg-slate-300 cursor-pointer"
        type="button"
        onClick={handleSubmit}
        value="Créer"
      />
    </div>
  )
}

TeamCreationForm.propTypes = {
  updateTeamsList: PropTypes.func
}

export default TeamCreationForm

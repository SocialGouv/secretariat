import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";

function AddUserForm() {
  const initial_values = {
    firstname: "",
    lastname: "",
    email: "",
    profile: "",
    expiration: "",
    teams: {},
  };
  const [inputs, setInputs] = useState(initial_values);

  useQuery(
    gql`
      query getTeams {
        teams {
          name
        }
      }
    `,
    {
      onCompleted: (data) => {
        setInputs((values) => {
          const new_teams = data.teams.reduce(
            (result, team) => ((result[team.name] = false), result),
            {}
          );
          return { ...values, teams: new_teams };
        });
      },
    }
  );

  const handleTextChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({
      ...values,
      [name]: value,
    }));
    console.log(inputs);
  };

  const handleTeamsChange = (event) => {
    const team_name = event.target.name
    const value = event.target.checked
    setInputs(values => ({
      ...values,
      teams: {...values.teams, [team_name]: value}
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstname"
        value={inputs.firstname}
        onChange={handleTextChange}
        placeholder="Prénom"
      />
      <input
        type="text"
        name="lastname"
        value={inputs.lastname}
        onChange={handleTextChange}
        placeholder="Nom"
      />
      <input
        type="text"
        name="email"
        value={inputs.email}
        onChange={handleTextChange}
        placeholder="Email"
      />
      <select name="profile" value={inputs.profile} onChange={handleTextChange}>
        <option value="" disabled>
          Profil
        </option>
        <option value="dev">Dev</option>
        <option value="product">Produit</option>
      </select>
      <input
        type="date"
        name="expiration"
        value={inputs.expiration}
        onChange={handleTextChange}
      />
      {Object.keys(inputs.teams).map((team) => (
        <label key={team}>
          <input
            name={team}
            key={team}
            type="checkbox"
            checked={inputs.teams[team]}
            onChange={handleTeamsChange}
          />
          {team}
        </label>
      ))}
      <input type="submit" />
    </form>
  );
}

export default AddUserForm;

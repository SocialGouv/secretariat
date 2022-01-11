import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

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
        const new_teams = data.teams.reduce((result, team) => {
          result[team.name] = false;
          return result;
        }, {});
        setInputs((values) => {
          return { ...values, teams: new_teams };
        });
      },
    }
  );

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
  `);

  const [insertUserTeam] = useMutation(gql`
    mutation InsertUserTeam($objects: [user_team_insert_input!] = {}) {
      insert_user_team(objects: $objects) {
        returning {
          id
        }
      }
    }
  `);

  const handleTextChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({
      ...values,
      [name]: value,
    }));
  };

  const handleTeamsChange = (event) => {
    const team_name = event.target.name;
    const value = event.target.checked;
    setInputs((values) => ({
      ...values,
      teams: { ...values.teams, [team_name]: value },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    insertUser({
      variables: {
        firstname: inputs.firstname,
        lastname: inputs.lastname,
        email: inputs.email,
        profile: inputs.profile,
        expiration: inputs.expiration,
      },
      onCompleted: (data) => {
        console.log("User added successfully");
        const teams_to_insert = Object.keys(inputs.teams).filter(
          (team) => inputs.teams[team]
        );
        insertUserTeam({
          variables: {
            objects: Array.from(teams_to_insert, (team) => ({
              team_name: team,
              user_id: data.insert_users_one.id,
            })),
          },
          onCompleted: (_) => {
            console.log("User's teams added successfully");
          },
        });
      },
    });
  };

  return (
    <form className="flex flex-col gap-y-4 items-center" onSubmit={handleSubmit}>
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
        type="email"
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
      <input
        className="p-2 rounded-md bg-slate-200 hover:bg-slate-300 cursor-pointer"
        type="date"
        name="expiration"
        value={inputs.expiration}
        onChange={handleTextChange}
      />
      <span className="">Équipes :</span>
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
      <input className="rounded-md bg-slate-200 px-4 py-2 hover:bg-slate-300 cursor-pointer" type="submit" />
    </form>
  );
}

export default AddUserForm;

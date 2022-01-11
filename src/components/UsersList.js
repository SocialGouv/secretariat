import React, { useState } from "react";
import User from "./User";
import { gql, useQuery } from "@apollo/client";

function UsersList() {
  const [users, setUsers] = useState([]);
  useQuery(
    gql`
      query getUsers {
        users {
          email
          id
          expiration
          firstname
          lastname
          profile
        }
      }
    `,
    {
      onCompleted: (data) => {
        setUsers(data.users)
      },
      onError: (error) => console.log(error),
    }
  );

  return (
    <div className="grid grid-cols-5">
      <div className="font-bold">Prénom</div>
      <div className="font-bold">Nom</div>
      <div className="font-bold">Email</div>
      <div className="font-bold">Profile</div>
      <div className="font-bold">Expiration</div>
      {users.map((user) => (
        <User user={user} key={user.id} />
      ))}
    </div>
  );
}

export default UsersList;

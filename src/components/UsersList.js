import React, { useState } from "react";
import User from "./User";
import { gql, useQuery } from "@apollo/client";

function UsersList() {
  const [users, setUsers] = useState([]);
  const {refetch: refetchUsers } = useQuery(
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

  const updateUsersList = () => {refetchUsers()}

  return (
    <div className="grid grid-cols-6 gap-y-2">
      <div className="font-bold">Prénom</div>
      <div className="font-bold">Nom</div>
      <div className="font-bold">Email</div>
      <div className="font-bold">Profile</div>
      <div className="font-bold">Expiration</div>
      <div></div>
      {users.map((user) => (
        <User user={user} key={user.id} updateUsersList={updateUsersList} />
      ))}
    </div>
  );
}

export default UsersList;

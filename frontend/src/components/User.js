import React from "react";
import { gql, useMutation } from "@apollo/client";

function User(props) {
  const [deleteUser] = useMutation(gql`
    mutation DeleteUser($id: Int!) {
      delete_users_by_pk(id: $id) {
        id
      }
    }
  `);

  const handleDelete = (id) => {
    deleteUser({
      variables: { id: id },
      onCompleted: (data) => {
        console.log("User deleted successfully");
        props.updateUsersList();
      },
    });
  };

  return (
    <React.Fragment>
      <div>{props.user.firstname}</div>
      <div>{props.user.lastname}</div>
      <div>{props.user.email}</div>
      <div>{props.user.profile}</div>
      <div>{props.user.expiration}</div>
      <button
        className="font-normal rounded-md bg-slate-200 hover:bg-slate-300 px-4 py-1 w-min"
        onClick={(_) => handleDelete(props.user.id)}
      >
        Supprimer
      </button>
    </React.Fragment>
  );
}

export default User;

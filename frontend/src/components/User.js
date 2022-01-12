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
      <div className="overflow-hidden text-ellipsis">{props.user.firstname}</div>
      <div className="overflow-hidden text-ellipsis">{props.user.lastname}</div>
      <div className="overflow-hidden text-ellipsis">{props.user.email}</div>
      <div className="overflow-hidden text-ellipsis">{props.user.profile}</div>
      <div className="overflow-hidden text-ellipsis">{props.user.expiration}</div>
      <div className="overflow-hidden text-ellipsis">{props.user.user_teams.map(team => (<div key={team.team_name}>{team.team_name}</div>))}</div>
      <button
        className="font-normal rounded-md bg-slate-200 hover:bg-slate-300 px-4 py-1 w-min h-min"
        onClick={(_) => handleDelete(props.user.id)}
      >
        Supprimer
      </button>
    </React.Fragment>
  );
}

export default User;

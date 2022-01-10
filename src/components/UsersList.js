import React, { useState } from "react";
import User from "./User";
import { gql, useQuery } from "@apollo/client";
import "../styles/UsersList.css";

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
    <div className="grid-container">
      <div className="grid-element"><b>Prénom</b></div>
      <div className="grid-element"><b>Nom</b></div>
      <div className="grid-element"><b>Email</b></div>
      <div className="grid-element"><b>Profile</b></div>
      <div className="grid-element"><b>Expiration</b></div>
      {users.map((user) => (
        <User user={user} key={user.firstname} />
      ))}
    </div>
  );
}

// class UsersList extends React.Component {
//   constructor(props) {
//     super(props);
//     const { loading, error, data } = useLazyQuery(gql`
//       query getUsers {
//         users {
//           email
//           id
//           expiration
//           firstname
//           lastname
//           profile
//         }
//       }
//     `, {onCompleted: (data) => this.setState(data)});
//     this.state = {
//       users: []
//     };
//   }

//   render() {
//     return (
//       <div className="grid-container">
//         <div className="grid-element">Firstname</div>
//         <div className="grid-element">Lastname</div>
//         {this.state.users.map((user) => (
//           <User user={user} key={user.firstname} />
//         ))}
//       </div>
//     );
//   }
// }

export default UsersList;

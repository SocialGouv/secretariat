import React from "react";

function User(props) {
  console.log(props.user);
  return (
    <React.Fragment>
      <div className="grid-element">{props.user.firstname}</div>
      <div className="grid-element">{props.user.lastname}</div>
      <div className="grid-element">{props.user.email}</div>
      <div className="grid-element">{props.user.profile}</div>
      <div className="grid-element">{props.user.expiration}</div>
    </React.Fragment>
  );
  return Object.entries(props.user).map(([key, value]) => (
    <div className="grid-element">{value}</div>
  ));
  // return (
  //     {user.entries().map((attribute) => (
  //       <div className="grid-element" key={user.firstname}>
  //         {attribute}
  //       </div>
  //     ))}
  // )
}

export default User;

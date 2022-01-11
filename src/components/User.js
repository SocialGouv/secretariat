import React from "react";

function User(props) {
  return (
    <React.Fragment>
      <div className="grid-element">{props.user.firstname}</div>
      <div className="grid-element">{props.user.lastname}</div>
      <div className="grid-element">{props.user.email}</div>
      <div className="grid-element">{props.user.profile}</div>
      <div className="grid-element">{props.user.expiration}</div>
    </React.Fragment>
  );
}

export default User;

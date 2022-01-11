import AddUserForm from "components/AddUserForm";
import UsersList from "components/UsersList";
import React from "react";
import "./App.css";

function App() {
  return (
    <div>
      <UsersList />
      <AddUserForm />
    </div>
  );
}

export default App;

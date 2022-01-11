import React from "react";
import AddUserForm from "components/AddUserForm";
import UsersList from "components/UsersList";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
    <nav>
      <Link to="/">Liste des utilisateurs</Link>
      <Link to="/add-user">Ajouter un utilisateur</Link>
    </nav>
      <Routes>
        <Route path="/" element={<UsersList />} />
        <Route path="/add-user" element={<AddUserForm />} />
      </Routes>
    </div>
  );
}

export default App;

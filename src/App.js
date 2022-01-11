import React from "react";
import AddUserForm from "components/AddUserForm";
import UsersList from "components/UsersList";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="App text-center text-lg">
      <nav className="mt-8 flex flex-row justify-evenly">
        <Link className="rounded-md bg-slate-200 px-8 py-3 hover:bg-slate-300" to="/">Liste des utilisateurs</Link>
        <Link className="rounded-md bg-slate-200 px-8 py-3 hover:bg-slate-300" to="/add-user">Ajouter un utilisateur</Link>
      </nav>
      <div className="mt-8">
        <Routes>
          <Route path="/" element={<UsersList />} />
          <Route path="/add-user" element={<AddUserForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

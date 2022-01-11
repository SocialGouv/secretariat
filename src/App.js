import React, { useState } from "react";
import AddUserForm from "components/AddUserForm";
import UsersList from "components/UsersList";
import { Routes, Route, Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

function App() {
  const [users, setUsers] = useState([]);
  const { refetch: refetchUsers } = useQuery(
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
        setUsers(data.users);
      },
      onError: (error) => console.log(error),
    }
  );
  const updateUsersList = () => {
    refetchUsers();
  };

  return (
    <div className="App text-center text-lg">
      <nav className="mt-8 flex flex-row justify-evenly">
        <Link
          className="rounded-md bg-slate-200 px-8 py-3 hover:bg-slate-300"
          to="/"
        >
          Liste des utilisateurs
        </Link>
        <Link
          className="rounded-md bg-slate-200 px-8 py-3 hover:bg-slate-300"
          to="/add-user"
        >
          Ajouter un utilisateur
        </Link>
      </nav>
      <div className="mt-8">
        <Routes>
          <Route path="/" element={
            <UsersList users={users} updateUsersList={updateUsersList} />
          } />
          <Route path="/add-user" element={
          <AddUserForm updateUsersList={updateUsersList} />
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;

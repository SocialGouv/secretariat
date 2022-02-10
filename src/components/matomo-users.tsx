import { useState } from "react"

import useMatomoUsers from "@/services/matomo"
import Loader from "@/components/common/loader"
import UserList from "@/components/users/user-list"
import UserProfile from "@/components/users/user-profile"

const MatomoUsers = () => {
  const users = useMatomoUsers()
  const [selectedUser, setSelectedUser] = useState<MatomoUser>()

  if (!users) return <Loader />
  if (!users.length) return <div>Aucun utilisateur pour le moment...</div>

  return (
    <div className="github-users">
      <UserList
        users={users}
        selectedUser={selectedUser}
        getUserData={(user) => user as User}
        onSelect={(user) => setSelectedUser(user as MatomoUser)}
      />
      {selectedUser && (
        <UserProfile>
          <div>Login: {selectedUser.login}</div>
          <div>Email: {selectedUser.email}</div>
          <div>Date de création: {selectedUser.date_registered}</div>
          <div>2FA acitvé: {selectedUser.uses_2fa ? "oui" : "non"}</div>
        </UserProfile>
      )}
    </div>
  )
}

export default MatomoUsers

// import Image from "next/image"
// import { useState } from "react"

// const Users = ({ users = [] }: { users: MatomoUser[] }) => {
//   const [selectedUser, setSelectedUser] = useState<MatomoUser>()

//   return (
//     <div className="github-users">
//       <ul className="user-list">
//         {users.map((user, i) => (
//           <li
//             key={i}
//             className={`tile${
//               selectedUser && selectedUser.login === user.login
//                 ? " selected"
//                 : ""
//             }`}
//             onClick={() => setSelectedUser(user)}
//           >
//             <div className="user">
//               <Image
//                 width={48}
//                 height={48}
//                 alt="user avatar"
//                 src="/images/avatar.jpeg"
//               />
//               <div className="info">
//                 <h3>{user.login}</h3>
//                 <div className="email">{user.email}</div>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ul>
//       {selectedUser && (
//         <div className="selected-user">
//           <div className="sticky-container">
//             <div className="user-profile">
//               <div>Login: {selectedUser.login}</div>
//               <div>Email: {selectedUser.email}</div>
//               <div>Date de création: {selectedUser.date_registered}</div>
//               <div>2FA acitvé: {selectedUser.uses_2fa ? "oui" : "non"}</div>
//               <div>Super User: {selectedUser.superuser_access}</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Users

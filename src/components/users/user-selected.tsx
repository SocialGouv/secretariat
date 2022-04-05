import UserProfile from "@/components/users/user-profile"

const UserSelected = ({
  user,
  onUserDrop,
  onUserEdit,
  onAccountsChanged,
}: {
  user?: User
  onUserDrop: (user: User) => void
  onUserEdit: (user: User) => void
  onAccountsChanged: (user: User) => void
}) => (
  <div className="user-selected">
    <div className="box sticky-container">
      {user ? (
        <UserProfile
          user={user}
          onUserDrop={onUserDrop}
          onUserEdit={onUserEdit}
          onAccountsChanged={onAccountsChanged}
        />
      ) : (
        <div className="no-user-selected">
          <div>Aucun utilisateur sélectionné.</div>
        </div>
      )}
    </div>
  </div>
)

export default UserSelected

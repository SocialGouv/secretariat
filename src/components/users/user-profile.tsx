const UserProfile = ({ children }: { children: JSX.Element[] }) => (
  <div className="selected-user">
    <div className="sticky-container">
      <div className="user-profile">{children}</div>
    </div>
  </div>
)

export default UserProfile

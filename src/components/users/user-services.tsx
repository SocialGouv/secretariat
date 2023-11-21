import UserServiceInfo from "@/components/users/user-service-info"

const UserServices = ({
  user,
  onDetachAccount,
  onToggleAccount,
}: {
  user: User
  onDetachAccount: (account: ServiceAccount) => void
  onToggleAccount: (account: AccountToToggle) => void
}) => {
  const isSingleAccount = user.services.length <= 1

  return (
    <div className="services">
      {user.services.map((account) => (
        <UserServiceInfo
          user={user}
          key={account.id}
          account={account}
          isSingleAccount={isSingleAccount}
          onDetachAccount={onDetachAccount}
          onToggleAccount={onToggleAccount}
        />
      ))}
    </div>
  )
}

export default UserServices

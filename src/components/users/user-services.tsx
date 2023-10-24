import UserServiceInfo from "@/components/users/user-service-info"

const UserServices = ({
  services,
  onDetachAccount,
  onToggleAccount,
}: {
  services: ServiceAccount[]
  onDetachAccount: (account: ServiceAccount) => void
  onToggleAccount: (account: AccountToToggle) => void
}) => {
  const isSingleAccount = services.length <= 1

  return (
    <div className="services">
      {services.map((account) => (
        <UserServiceInfo
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

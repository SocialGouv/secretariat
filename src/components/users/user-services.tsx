import UserServiceInfo from "@/components/users/user-service-info"

const UserServices = ({
  services,
  onDetachAccount,
}: {
  services: ServiceAccount[]
  onDetachAccount: (account: ServiceAccount) => void
}) => {
  const isSingleAccount = !(services.length > 1)
  return (
    <div className="services">
      {services.map((service, i) => (
        <UserServiceInfo
          key={i}
          account={service}
          isSingleAccount={isSingleAccount}
          onDetachAccount={onDetachAccount}
        />
      ))}
    </div>
  )
}

export default UserServices

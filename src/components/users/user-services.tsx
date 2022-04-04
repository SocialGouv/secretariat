import UserServiceInfo from "@/components/users/user-service-info"

const UserServices = ({ services }: { services: ServiceAccount[] }) => (
  <div className="services">
    {services.map((service, i) => (
      <UserServiceInfo key={i} account={service} />
    ))}
  </div>
)

export default UserServices

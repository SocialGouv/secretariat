import SERVICES from "@/utils/SERVICES"
import Badge from "@/components/common/badge"
import UserHeader from "@/components/users/user-header"
import ServiceLogo from "@/components/common/service-logo"

const UserTemplate = ({ user }: { user: User }) => (
  <div className="user">
    <UserHeader user={user} />
    <div
      className={`alerts-services${
        user.warning ||
        (user.departure &&
          new Date(user.departure).getTime() < new Date().getTime())
          ? ""
          : " no-alert"
      }`}
    >
      <div>
        {user.warning && <Badge type="warning" label="Alerte" />}
        {user.departure &&
          new Date(user.departure).getTime() < new Date().getTime() && (
            <Badge type="expiry" label="Expiration" />
          )}
      </div>
      <div className="services">
        {SERVICES.map((service, i) => (
          <div key={i} className={user[service] ? "" : "opacity-25"}>
            <ServiceLogo service={service} size="sm" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default UserTemplate

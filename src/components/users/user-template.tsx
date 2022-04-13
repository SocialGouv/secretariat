import SERVICES from "@/utils/SERVICES"
import Badge from "@/components/common/badge"
import UserHeader from "@/components/users/user-header"
import ServiceLogo from "@/components/common/service-logo"

const UserTemplate = ({ user }: { user: User }) => {
  const userIsExpired =
    user.departure && new Date(user.departure).getTime() < new Date().getTime()

  return (
    <div className="user-template">
      <UserHeader user={user} />
      <div
        className={`alerts-services${
          user.warnings.length > 0 || userIsExpired ? "" : " no-alert"
        }`}
      >
        <div>
          {user.warnings.length > 0 && <Badge type="warning" title="alerte" />}
          {userIsExpired && <Badge type="expiry" title="expiration" />}
        </div>
        <div className="services">
          {SERVICES.map((service, i) => (
            <div
              key={i}
              className={
                user.services.find((s) => s.type === service)
                  ? ""
                  : "opacity-25 dark:opacity-35"
              }
            >
              <ServiceLogo name={service} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserTemplate

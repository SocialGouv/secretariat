import Image from "next/image"

import SERVICES from "@/utils/SERVICES"
import Badge from "@/components/common/badge"
import UserHeader from "@/components/users/user-header"
import ServiceLogo from "@/components/common/service-logo"

const UserTemplate = ({ user }: { user: User }) => (
  <div className="user">
    <UserHeader user={user} />
    <div className={`alerts-services${user.warning ? "" : " no-alert"}`}>
      {user.warning && <Badge type="warning" label="Alerte" />}
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

import Image from "next/image"

import SERVICES from "@/utils/SERVICES"
import Badge from "@/components/common/badge"
import ServiceLogo from "@/components/common/service-logo"

const UserTemplate = ({ user }: { user: User }) => (
  <div className="user">
    <div className="details">
      <div>
        <Image
          width={48}
          height={48}
          alt="user avatar"
          src={user.avatarUrl || "/images/user-avatar.svg"}
        />
      </div>
      <div className="info">
        <h3>
          {user.name || user.login}{" "}
          {user.name && user.login && <span>({user.login})</span>}
        </h3>
        <div className="email">{user.email}</div>
      </div>
    </div>
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

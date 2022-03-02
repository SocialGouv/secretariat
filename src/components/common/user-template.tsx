import Image from "next/image"

import SERVICES from "@/utils/SERVICES"
import ServiceLogo from "./service-logo"

const UserTemplate = ({ user }: { user: User }) => (
  <div className="user">
    <div className="details">
      <div>
        <Image
          width={48}
          height={48}
          alt="user avatar"
          src={user.avatarUrl || "/images/avatar.jpeg"}
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
    <div className="services">
      {SERVICES.map((service, i) => (
        <div key={i} className={user[service] ? "" : "opacity-25"}>
          <ServiceLogo service={service} size="sm" />
        </div>
      ))}
    </div>
  </div>
)

export default UserTemplate

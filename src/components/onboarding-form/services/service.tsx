import { useEffect, useState } from "react"
import ServiceLogo from "@/components/common/service-logo"

const Service = ({
  service,
  onStatusChange,
  enabled = false,
}: {
  enabled?: boolean
  service: ServiceName
  onStatusChange: (service: ServiceName, checked: boolean) => void
}) => {
  const [checked, setChecked] = useState<boolean>(enabled)

  // useEffect(() => {
  //   onStatusChange(service, checked)
  // }, [checked, service, onStatusChange])

  return (
    <div
      onClick={() => setChecked(!checked)}
      className={`service ${checked ? "" : "disabled"}`}
    >
      <div className="service-body">
        <ServiceLogo name={service} size="2xl" disabled={!enabled} />
        <div className="name">{service}</div>
      </div>
    </div>
  )
}

export default Service

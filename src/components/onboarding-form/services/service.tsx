import ServiceLogo from "@/components/common/service-logo"

const Service = ({
  service,
  onToggle,
  enabled = false,
}: {
  enabled?: boolean
  service: ServiceName
  onToggle: () => void
}) => (
  <div onClick={onToggle} className={`service ${enabled ? "" : "disabled"}`}>
    <div className="service-body">
      <ServiceLogo name={service} size="2xl" disabled={!enabled} />
      <div className="name">{service}</div>
    </div>
  </div>
)

export default Service

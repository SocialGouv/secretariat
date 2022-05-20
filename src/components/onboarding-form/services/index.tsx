import Service from "./service"

const Services = ({
  services,
  onStatusChange,
}: {
  services: Record<ServiceName, boolean>
  onStatusChange: (service: ServiceName, checked: boolean) => void
}) => (
  <div className="services-tiles">
    {Object.entries(services).map(([service, enabled], i) => (
      <Service
        key={i}
        enabled={enabled}
        onStatusChange={onStatusChange}
        service={service as ServiceName}
      />
    ))}
  </div>
)

export default Services

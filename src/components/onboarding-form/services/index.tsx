import Service from "./service"

const Services = ({
  services,
  onStatusChange,
}: {
  services: Ruru
  onStatusChange?: (service: ServiceName, enabled: boolean) => void
}) => (
  <div className="services-tiles">
    {Object.entries(services).map(([service, enabled], i) => (
      <Service
        key={i}
        enabled={enabled}
        service={service as ServiceName}
        onToggle={() =>
          onStatusChange && onStatusChange(service as ServiceName, !enabled)
        }
      />
    ))}
  </div>
)

export default Services

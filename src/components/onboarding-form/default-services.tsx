import useOnboarding from "@/hooks/use-onboarding"
import ServiceAccounts from "@/components/onboarding-form/services"

const DefaultServices = () => {
  const { data, mutate } = useOnboarding()
  const { services } = data

  return (
    <div className="services">
      <h3>Services de la Fabrique Numérique:</h3>
      <br />
      <ServiceAccounts
        services={services}
        onStatusChange={(service, enabled) =>
          mutate({ ...data, services: { ...services, [service]: enabled } })
        }
      />
    </div>
  )
}

export default DefaultServices

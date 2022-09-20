import useOnboarding from "@/hooks/use-onboarding"
import ServiceAccounts from "@/components/onboarding-form/services"

const DefaultServices = () => {
  const { data, mutate } = useOnboarding()
  const { services } = data || {}

  return (
    <div className="card services">
      <h3>Services de la Fabrique Numérique:</h3>
      <p>Sélectionnez les services qui vous intéressent.</p>
      {services && (
        <ServiceAccounts
          services={services}
          onStatusChange={(service, enabled) =>
            mutate({ ...data, services: { ...services, [service]: enabled } })
          }
        />
      )}
      <p>
        Des comptes dédiés seront créés pour vous. Les informations de connexion
        vous seront envoyées par mail ultérieurement.
      </p>
    </div>
  )
}

export default DefaultServices

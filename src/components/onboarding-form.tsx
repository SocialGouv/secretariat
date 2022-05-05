import fetcher from "@/utils/rest-fetcher"
import SERVICES from "@/utils/SERVICES"
import { FormEvent, useEffect, useState } from "react"
import Alert from "./common/alert"
import ServiceLogo from "./common/service-logo"

interface FormData {
  email: string
  message: string
  lastName: string
  firstName: string
  endDate: string | number | readonly string[] | undefined
  startDate: string | number | readonly string[] | undefined
}

const Info = ({
  data: { firstName, lastName, email, startDate, endDate, message },
  handleChange,
}: {
  data: FormData
  handleChange: (name: string, value: string) => void
}) => (
  <div className="info">
    <label htmlFor="firstName" className="col-span-2">
      Prénom:
      <input
        required
        type="text"
        id="firstName"
        name="firstName"
        value={firstName}
        placeholder="Jean"
        autoComplete="given-name"
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
    </label>
    <label htmlFor="lastName" className="col-span-2">
      Nom:
      <input
        required
        type="text"
        id="lastName"
        name="lastName"
        value={lastName}
        autoComplete="on"
        placeholder="Dupont"
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
    </label>
    <label htmlFor="email" className="col-span-2">
      Email:
      <input
        required
        id="email"
        type="email"
        name="email"
        value={email}
        autoComplete="on"
        placeholder="jean.dupont@domaine.fr"
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
    </label>
    <label htmlFor="startDate">
      Date de début:
      <input
        required
        type="date"
        id="startDate"
        name="startDate"
        value={startDate}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
    </label>
    <label htmlFor="endDate">
      Date de fin:
      <input
        required
        type="date"
        id="endDate"
        name="endDate"
        value={endDate}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
    </label>
    <label htmlFor="#message" className="col-span-4">
      Présentation:
      <textarea
        rows={3}
        required
        name="message"
        value={message}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
        placeholder="Bonjour, je suis PO sur le produit XXX et je souhaiterais obtenir des accès à Matomo, ainsi qu'à l'organisation Github de la Fabrique Numérique."
      ></textarea>
    </label>
  </div>
)

// const OVHFields = () => (
//   <div className="fields">
//   <label htmlFor="#ovh-email"></label>
//   <input type="text" id="ovh-email" />
//   </div>
// )
// const GithubFields = () => (
//   <div className="fields">
//   <label htmlFor="#github"></label>
//   <input type="text" id="github" />
//   </div>
// )
// const ZammadFields = () => (
//   <div className="fields">
//   <label htmlFor="#zammad-github"></label>
//   <input type="text" id="zammad-github" />
//   </div>
// )
// const NextCloudFields = () => (
//   <div className="fields">
//   <label htmlFor="#nextcloud-github"></label>
//   <input type="text" id="nextcloud-github" />
//   </div>
// )

const Service = ({
  service,
  onStatusChange,
}: {
  service: keyof ServiceAccountsMapping
  onStatusChange: (
    service: keyof ServiceAccountsMapping,
    checked: boolean
  ) => void
}) => {
  const [checked, setChecked] = useState(service === "mattermost")

  useEffect(() => {
    onStatusChange(service, checked)
  }, [checked, service, onStatusChange])

  return (
    <div
      onClick={() => setChecked(!checked)}
      className={`service ${checked ? "" : "disabled"}`}
    >
      <div className="service-body">
        <ServiceLogo name={service} size="2xl" disabled={false} />
        <div className="name">{service}</div>
      </div>
    </div>
  )
}

const ServiceAccounts = ({
  onStatusChange,
}: {
  onStatusChange: (
    service: keyof ServiceAccountsMapping,
    checked: boolean
  ) => void
}) => (
  <div className="service-accounts">
    {SERVICES.map((service, i) => (
      <Service key={i} service={service} onStatusChange={onStatusChange} />
    ))}
  </div>
)

const OnboardingForm = () => {
  const [data, setData] = useState({
    email: "",
    message: "",
    lastName: "",
    firstName: "",
    endDate: new Date().toLocaleDateString("en-CA"),
    startDate: new Date().toLocaleDateString("en-CA"),
  })

  const [status, setStatus] = useState<"edit" | "success" | "error">("edit")

  const handleClick = (
    service: keyof ServiceAccountsMapping,
    checked: boolean
  ) => {
    console.log("handleClick", service, checked)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = await fetcher("/api/onboarding/request", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    })
    console.log("RESULT", result)
    if (!result || !result.ok) setStatus("error")
    else if (result.ok) setStatus("success")
  }

  return (
    <div className="onboarding">
      <div className="flex mt-8">
        <div className="text-7xl flex items-center pr-6">🛳️</div>
        <div>
          <h2>Embarquement à la Fabrique Numérique des Ministères Sociaux</h2>
          <p className="pt-2">
            Remplissez le formulaire suivant afin d&apos;effectuer une demande
            d&apos;embarquement à la Fabrique Numérique des Ministères Sociaux.
          </p>
        </div>
      </div>
      {status === "edit" && (
        <form onSubmit={handleSubmit}>
          <Info
            data={data}
            handleChange={(name, value) => setData({ ...data, [name]: value })}
          />
          <ServiceAccounts onStatusChange={handleClick} />
          <button className="primary" type="submit">
            Envoyer
          </button>
        </form>
      )}
      {status === "success" && (
        <div className="mt-12">
          <Alert
            type="success"
            message="Un email de confirmation vient de vous être envoyé."
          />
        </div>
      )}
      {status === "error" && (
        <div className="mt-12">
          <Alert
            type="error"
            message="Une erreur est survenue veuillez réessayer ultérieurement."
          />
        </div>
      )}
    </div>
  )
}

export default OnboardingForm

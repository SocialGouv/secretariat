import { useEffect } from "react"

import useOnboarding from "@/hooks/use-onboarding"

const FirstName = () => {
  const { data, mutate } = useOnboarding()

  return (
    <label htmlFor="firstName" className="col-span-2">
      <div className="flex justify-between">
        <div>Prénom*</div>
        <div className="text-xs">(obligatoire)</div>
      </div>
      <input
        required
        type="text"
        id="firstName"
        name="firstName"
        placeholder="Jean"
        value={data?.firstName}
        autoComplete="given-name"
        onChange={(e) => mutate({ ...data, firstName: e.target.value })}
      />
    </label>
  )
}

const LastName = () => {
  const { data, mutate } = useOnboarding()

  return (
    <label htmlFor="lastName" className="col-span-2">
      <div className="flex justify-between">
        <div>Nom*</div>
        <div className="text-xs">(obligatoire)</div>
      </div>
      <input
        required
        type="text"
        id="lastName"
        name="lastName"
        autoComplete="on"
        placeholder="Dupont"
        value={data?.lastName}
        onChange={(e) => mutate({ ...data, lastName: e.target.value })}
      />
    </label>
  )
}

const Email = () => {
  const { data, mutate } = useOnboarding()

  return (
    <label htmlFor="email" className="col-span-2">
      <div className="flex justify-between">
        <div>Email*</div>
        <div className="text-xs">(obligatoire)</div>
      </div>
      <input
        required
        id="email"
        type="email"
        name="email"
        autoComplete="on"
        value={data?.email}
        placeholder="jean.dupont@domaine.fr"
        onChange={(e) => mutate({ ...data, email: e.target.value })}
      />
    </label>
  )
}

const Arrival = () => {
  const { data, mutate } = useOnboarding()

  return (
    <label htmlFor="arrival">
      Date de début
      <input
        required
        type="date"
        id="arrival"
        name="arrival"
        value={data?.arrival}
        onChange={(e) => mutate({ ...data, arrival: e.target.value })}
      />
    </label>
  )
}

const Departure = () => {
  const { data, mutate } = useOnboarding()

  return (
    <label htmlFor="departure">
      Date de fin
      <input
        required
        type="date"
        id="departure"
        name="departure"
        value={data?.departure}
        onChange={(e) => mutate({ ...data, departure: e.target.value })}
      />
    </label>
  )
}

const Message = () => {
  const { data, mutate } = useOnboarding()

  return (
    <label htmlFor="#message" className="col-span-4">
      <div className="flex justify-between">
        <div>Présentation*</div>
        <div className="text-xs">(obligatoire)</div>
      </div>
      <textarea
        rows={3}
        required
        name="message"
        value={data?.message}
        onChange={(e) => mutate({ ...data, message: e.target.value })}
        placeholder="Bonjour, je suis PO sur le produit XYZ et je souhaiterais obtenir des accès à la messagerie instantanée ainsi qu'à l'organisation Github de la Fabrique Numérique."
      ></textarea>
    </label>
  )
}

const UserInfo = ({
  onValidate,
}: {
  onValidate: (isValid: boolean) => void
}) => {
  const { data } = useOnboarding()

  useEffect(() => {
    onValidate(
      !!(
        data &&
        data.firstName.length &&
        data.lastName.length &&
        data.email.length &&
        data.message.length
      )
    )
  }, [data, onValidate])

  return (
    <div className="user-info">
      <div className="fields">
        <FirstName />
        <LastName />
        <Email />
        <Arrival />
        <Departure />
        <Message />
      </div>
    </div>
  )
}

export default UserInfo

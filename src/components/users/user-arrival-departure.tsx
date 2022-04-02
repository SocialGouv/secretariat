import { useEffect, useState } from "react"

const UserArrivalDeparture = ({
  arrival,
  departure,
  onChange,
}: {
  arrival?: string
  departure?: string
  onChange: (dates: Record<"arrival" | "departure", string | undefined>) => void
}) => {
  const [a, setArrival] = useState(arrival)
  const [d, setDeparture] = useState(departure)

  const handleChange = async (
    dates: Record<"arrival" | "departure", string | undefined>
  ) => {
    setArrival(dates.arrival)
    setDeparture(dates.departure)
    onChange(dates)
  }

  useEffect(() => {
    setArrival(arrival)
    setDeparture(departure)
  }, [arrival, departure])

  return (
    <div className="user-arrival-departure">
      <label htmlFor="arrival">
        Arrivée:
        <input
          value={a || ""}
          type="date"
          id="arrival"
          onChange={(e) =>
            handleChange({ arrival: e.target.value, departure: d })
          }
        />
      </label>
      <label htmlFor="departure">
        Départ:
        <input
          value={d || ""}
          type="date"
          id="departure"
          onChange={(e) =>
            handleChange({ arrival: a, departure: e.target.value })
          }
        />
      </label>
    </div>
  )
}

export default UserArrivalDeparture

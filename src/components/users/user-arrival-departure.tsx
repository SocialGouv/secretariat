import { useEffect, useState } from "react"

const UserArrivalDeparture = ({
  arrival,
  departure,
  expired,
  onChange,
}: {
  expired: boolean
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
      <div className="date">
        <label htmlFor="arrival">Date d&apos;arrivée:</label>
        <div className="date-field">
          <input
            value={a || ""}
            type="date"
            id="arrival"
            onChange={(e) =>
              handleChange({ arrival: e.target.value, departure: d })
            }
            required
          />
        </div>
      </div>
      <div className={`date${expired ? " expired" : ""}`}>
        <label htmlFor="departure">Date de départ:</label>
        <div className="date-field">
          <input
            value={d || ""}
            type="date"
            id="departure"
            className={`${expired ? "error" : ""}`}
            onChange={(e) =>
              handleChange({ arrival: a, departure: e.target.value })
            }
            required
          />
        </div>
      </div>
    </div>
  )
}

export default UserArrivalDeparture

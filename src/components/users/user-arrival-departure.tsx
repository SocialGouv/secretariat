import { format } from "date-fns"
import { useState } from "react"
import DatePicker from "react-datepicker"

const DateField = ({
  date,
  onChange,
  displayValue,
}: {
  displayValue: string | JSX.Element
  date: Date | undefined
  onChange: (date: Date | null) => void
}) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="date-field">
      {isEditing ? (
        <DatePicker
          selected={date}
          autoFocus={true}
          onBlur={() => setIsEditing(false)}
          onChange={(date) => {
            onChange(date)
            setIsEditing(false)
          }}
          onClickOutside={() => setIsEditing(false)}
        />
      ) : (
        <div className="display-date" onClick={() => setIsEditing(true)}>
          {displayValue}
        </div>
      )}
    </div>
  )
}

const UserArrivalDeparture = ({
  user,
  onChange,
}: {
  user: User
  onChange: (user: User) => void
}) => {
  const handleChange = async (date: Record<string, Date | null>) => {
    // Applying timezone shift so that the day won't change later
    for (const key of Object.keys(date)) {
      if (date[key] !== null) {
        const currentDate = date[key] as Date
        date[key] = new Date(
          currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
        )
      }
    }
    onChange({ ...user, ...date })
  }

  return (
    <div className="user-arrival-departure">
      <DateField
        displayValue={
          user.arrival ? (
            <>
              <i className="ri-calendar-event-fill"></i>&nbsp;Arrivée le&nbsp;
              <strong>{format(new Date(user.arrival), "dd/MM/Y")}</strong>
            </>
          ) : (
            <i>aucune date d&apos;arrivée</i>
          )
        }
        date={user.arrival && new Date(user.arrival)}
        onChange={(date) => handleChange({ arrival: date })}
      />
      <DateField
        displayValue={
          user.departure ? (
            <>
              <i className="ri-calendar-event-fill"></i>&nbsp;Départ le&nbsp;
              <strong>{format(new Date(user.departure), "dd/MM/Y")}</strong>
            </>
          ) : (
            <i>aucune date de départ</i>
          )
        }
        date={user.departure && new Date(user.departure)}
        onChange={(date) => handleChange({ departure: date })}
      />
    </div>
  )
}

export default UserArrivalDeparture

import { useState } from "react"
import DatePicker from "react-datepicker"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import { updateUser } from "@/queries/index"

import { format } from "date-fns"

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
          // shouldCloseOnSelect={true}
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

const UserArrivalDeparture = ({ user }: { user: User }) => {
  const [token] = useToken()

  const handleChange = async (date: Record<string, Date | null>) => {
    const { id, email, name, warning, ...data } = user
    await fetcher(updateUser, token, { id, _set: { ...data, ...date } })
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
            <i>aucune date</i>
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
            <i>aucune date</i>
          )
        }
        date={user.departure && new Date(user.departure)}
        onChange={(date) => handleChange({ departure: date })}
      />
    </div>
  )
}

export default UserArrivalDeparture

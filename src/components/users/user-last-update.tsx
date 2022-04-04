import { format } from "date-fns"

const UserLastUpdate = ({ date }: { date?: string }) => (
  <div className="user-last-update">
    {date ? (
      <div>Mis à jour le {format(new Date(date), "dd/MM/Y")}</div>
    ) : (
      <i>aucune mise à jour</i>
    )}
  </div>
)

export default UserLastUpdate

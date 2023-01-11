import statusOk from "@/utils/status-ok"
import Alert from "@/components/common/alert"

type ServicesAccountsStatuses = Record<
  ServiceName,
  { status: number; body: string | Record<"message", string> }
>

const ServicesAccountsStatuses = ({
  statuses,
}: {
  statuses?: ServicesAccountsStatuses
}) => (
  <div className="servicesAccountsStatuses">
    {statuses &&
      Object.entries(statuses).map(([service, status], i) => (
        <Alert
          key={i}
          type={statusOk(status.status) ? "success" : "error"}
          title={service}
          message={
            typeof status.body === "string" ? status.body : status.body.message
          }
        />
      ))}
  </div>
)

export default ServicesAccountsStatuses

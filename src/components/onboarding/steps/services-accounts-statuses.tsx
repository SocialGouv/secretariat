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
          title={service}
          type={statusOk(status.status) ? "success" : "error"}
        >
          <>
            {typeof status.body === "string"
              ? status.body
              : status.body.message}
          </>
        </Alert>
      ))}
  </div>
)

export default ServicesAccountsStatuses

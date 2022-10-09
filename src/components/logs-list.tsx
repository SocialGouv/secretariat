import { format } from "date-fns"

import useLogs from "@/hooks/use-logs"

const LogsList = () => {
  const logs = useLogs()
  const DATE_FORMAT = "dd/MM/Y HH:mm:ss"

  const getActionIcon = (action: string) => {
    let icon = ""

    if (action === "merge") icon = "ri-git-merge-line"
    else if (action === "sync") icon = "ri-refresh-line"
    else if (action === "onboarding/request") icon = "ri-ship-line"
    else if (action === "onboarding/confirm") icon = "ri-mail-check-line"
    else if (action === "onboarding/review") icon = "ri-check-double-line"

    return icon
  }

  return (
    <div className="table border w-full">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell text-left w-44">
            <i className="ri-calendar-event-line text-xl leading-none align-sub mr-1" />
            Date
          </div>
          <div className="table-cell text-left w-28">
            <i className="ri-settings-3-line text-xl leading-none align-sub mr-1" />
            Action
          </div>
          <div className="table-cell text-left w-52">
            <i className="ri-user-3-line text-xl leading-none align-sub mr-1" />
            Utilisateur
          </div>
          <div className="table-cell text-left">
            <i className="ri-file-list-3-line text-xl leading-none align-sub mr-1" />
            Détails
          </div>
        </div>
      </div>
      <div className="table-row-group">
        {logs?.map((log: Logs, i: number) => (
          <div key={i} className="table-row">
            <div className="table-cell">
              {format(new Date(log.created_at), DATE_FORMAT)}
            </div>
            <div className="table-cell">
              <i
                className={`${getActionIcon(
                  log.action
                )} leading-none align-middle mr-1`}
              />
              {log.action}
            </div>
            <div className="table-cell">{log.user}</div>
            <div className="table-cell break-all">{log.parameters}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LogsList

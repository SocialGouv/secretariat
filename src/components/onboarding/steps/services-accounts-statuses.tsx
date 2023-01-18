import statusOk from "@/utils/status-ok"

type ServicesAccountsStatuses = Record<
  ServiceName,
  { status: number; body: string | Record<"message", string> }
>

const services: Record<string, Record<"icon" | "message", string>> = {
  github: {
    icon: "ri-git-pull-request-line",
    message: "Obtenir un accès aux repositories de SocialGouv (Github)",
  },
  mattermost: {
    icon: "ri-wechat-line",
    message: "Obtenir un compte de messagerie instantanée (Mattermost)",
  },
  ovh: {
    icon: "ri-mail-line",
    message: "Obtenir une adresse email @fabrique.social.gouv.fr (OVH)",
  },
}

const ServicesAccountsStatuses = ({
  statuses,
}: {
  statuses?: ServicesAccountsStatuses
}) => (
  <div className="services-accounts-statuses">
    <ul className="services-list">
      {statuses &&
        Object.entries(statuses).map(([service, { body, status }], i) => (
          <li key={i} className={`service selected`}>
            <i className={`${services[service].icon} icon`} />
            <div className="flex-1">
              <p>{services[service].message}</p>
              {!statusOk(status) && (
                <pre className="text-sm rounded mt-2 py-2 px-3 bg-red-marianne-950-main text-red-marianne-425-main">
                  {typeof body === "string" ? body : body.message}
                </pre>
              )}
            </div>

            {statusOk(status) ? (
              <i className="ri-check-line check" />
            ) : (
              <i className="ri-close-line check error" />
            )}
          </li>
        ))}
    </ul>
  </div>
)

export default ServicesAccountsStatuses

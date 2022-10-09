import Link from "next/link"
import { format } from "date-fns"

import useOnboardingRequests from "@/hooks/use-onboarding-requests"

const OnboardingRequestsList = () => {
  const DATE_FORMAT = "dd/MM/Y HH:mm:ss"
  const requests = useOnboardingRequests()

  return (
    <div className="table border w-full">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell text-left w-44">
            <i className="ri-calendar-event-line text-xl leading-none align-sub mr-1" />
            Date
          </div>
          <div className="table-cell text-left">
            <i className="ri-user-3-line text-xl leading-none align-sub mr-1" />
            Utilisateur
          </div>
          <div className="table-cell text-center w-28">
            <i className="ri-mail-line text-xl leading-none align-sub mr-1" />
            Email
          </div>
          <div className="table-cell text-center w-28">
            <i className="ri-check-double-line text-xl leading-none align-sub mr-1" />
            Revue
          </div>
        </div>
      </div>
      <div className="table-row-group">
        {requests?.map((request: OnboardingRequest, i: number) => (
          <div key={i} className="table-row">
            <div className="table-cell">
              {format(new Date(request.created_at), DATE_FORMAT)}
            </div>
            <div className="table-cell">
              <Link
                href={{
                  pathname: "/onboarding/review",
                  query: { id: request.id },
                }}
              >
                <a>
                  {request.data.firstName} {request.data.lastName}
                </a>
              </Link>
            </div>
            <div className="table-cell text-center">
              {request.confirmed ? (
                <i className="ri-checkbox-circle-line text-2xl leading-none align-middle" />
              ) : (
                <i className="ri-checkbox-blank-circle-line text-2xl leading-none align-middle" />
              )}
            </div>
            <div className="table-cell text-center">
              {request.reviewed ? (
                <i className="ri-checkbox-circle-line text-2xl leading-none align-middle" />
              ) : (
                <i className="ri-checkbox-blank-circle-line text-2xl leading-none align-middle" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OnboardingRequestsList

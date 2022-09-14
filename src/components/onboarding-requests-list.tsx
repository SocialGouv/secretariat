import Link from "next/link"
import { format } from "date-fns"

import useOnboardingRequests from "@/hooks/use-onboarding-requests"

const OnboardingRequestsList = () => {
  const onboardingRequest = useOnboardingRequests()

  return (
    <div className="onboarding-requests-list">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Revue</th>
          </tr>
        </thead>
        <tbody>
          {onboardingRequest?.map((request: OnboardingRequest, i: number) => (
            <tr key={i}>
              <td>
                {format(new Date(request.created_at), "dd/MM/Y HH:mm:ss")}
              </td>
              <td>
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
              </td>
              <td align="center">
                {request.confirmed ? (
                  <i className="ri-checkbox-circle-line text-2xl leading-none align-middle" />
                ) : (
                  <i className="ri-checkbox-blank-circle-line text-2xl leading-none align-middle" />
                )}
              </td>
              <td align="center">
                {request.reviewed ? (
                  <i className="ri-checkbox-circle-line text-2xl leading-none align-middle" />
                ) : (
                  <i className="ri-checkbox-blank-circle-line text-2xl leading-none align-middle" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OnboardingRequestsList

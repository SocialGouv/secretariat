import useOnboardingRequests from "@/hooks/use-onboarding-requests"
import Link from "next/link"

const OnboardingRequestsList = () => {
  const onboardingRequest = useOnboardingRequests()
  console.log("OnboardingRequestsList", onboardingRequest)

  return (
    <div className="onboarding-requests-list">
      <table>
        {onboardingRequest.map((request: OnboardingRequest, i: number) => (
          <tr key={i}>
            <td>{request.confirmed ? "validée" : "en attente"}</td>
            <td>
              <Link
                href={{
                  pathname: "/onboarding/review",
                  query: { id: request.id },
                }}
              >
                <a>{request.id}</a>
              </Link>
            </td>
            <td>{request.data.firstName}</td>
            <td>{request.data.lastName}</td>
            <td>{request.created_at}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default OnboardingRequestsList

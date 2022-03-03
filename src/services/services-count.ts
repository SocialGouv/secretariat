import useSWR from "swr"

import fetcher from "@/utils/fetcher"
import useToken from "@/services/token"
import { getServicesCount } from "@/queries/index"

const useServicesCount = () => {
  const [token] = useToken()

  const { data } = useSWR(token ? [getServicesCount, token] : null, fetcher)
  console.log("data", data)

  if (data) {
    return Object.entries(
      data as Record<
        ServiceName | "all",
        Record<"aggregate", Record<"count", number>>
      >
    ).reduce(
      (
        counts,
        [
          service,
          {
            aggregate: { count },
          },
        ]
      ) => ((counts[service] = count), counts),
      {} as Record<string, number>
    )
  }

  return data
}

export default useServicesCount

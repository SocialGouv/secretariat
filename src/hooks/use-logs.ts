import useSWR from "swr"

import graphQLFetcher from "@/utils/graphql-fetcher"
import { getLogs } from "@/queries/index"

const useLogs = () => {
  const getLogsData = async () => {
    const data = await graphQLFetcher({
      query: getLogs,
      includeCookie: true,
    })
    return data
  }

  const { data: { logs } = {} } = useSWR("/logs", getLogsData)

  return logs
}

export default useLogs

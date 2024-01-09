import logger from "./logger"
import * as Sentry from "@sentry/nextjs"

const fetcher = async (url: string, params: Record<string, unknown>) => {
  try {
    const response = await fetch(url, params)
    if (!response.ok) {
      logger.error({ response }, "Error status in response")
      return null
    }
    return response
  } catch (error) {
    logger.error(error, "Error attempting to fetch")
    Sentry.captureException(error)
  }
}

export default fetcher

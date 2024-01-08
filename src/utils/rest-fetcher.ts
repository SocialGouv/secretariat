import logger from "./logger"

const fetcher = async (url: string, params: Record<string, unknown>) => {
  try {
    const response = await fetch(url, params)
    if (!response.ok) {
      logger.error({ response }, "Error status in response")
      return null
    }
    return response
  } catch (error) {
    logger.error("Error attempting to fetch", error)
  }
}

export default fetcher

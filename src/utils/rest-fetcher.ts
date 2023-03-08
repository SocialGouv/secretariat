import logger from "./logger"

const fetcher = async (url: string, params: Record<string, unknown>) => {
  const response = await fetch(url, params)
  if (!response.ok) {
    logger.error({ response }, "Error status in response")
    return null
  }
  return response
}

export default fetcher

const fetcher = async (url: string, params: Record<string, unknown>) => {
  const response = await fetch(url, params)
  if (!response.ok) {
    console.error("Error status in response")
    console.error("Response head:", response)
    console.error("Response body:", await response.text())
    return null
  }
  return response
}

export default fetcher

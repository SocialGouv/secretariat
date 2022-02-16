const fetcher = async (url: string, params: Record<string, unknown>) => {
  const response = await fetch(url, params)
  if (!response.ok) {
    console.error("Error status in response:", response)
    return null
  }
  return response
}

export default fetcher

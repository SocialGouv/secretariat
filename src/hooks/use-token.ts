import useSWRImmutable from "swr/immutable"

const fetcher = async (url: string) => {
  // Tests run in node environment where only absolute urls are supported
  url = process.env.NODE_ENV === "test" ? `http://localhost:3000${url}` : url
  return fetch(url).then((r) => r.json())
}

const useToken = (): [string] => {
  const { data: { token } = {} } = useSWRImmutable("/api/jwt", fetcher)

  return [token]
}

export default useToken

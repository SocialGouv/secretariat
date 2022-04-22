import useSWRImmutable from "swr/immutable"

const fetcher = (url: string) => {
  // Tests run in node environment where only absolute urls are supported
  url = /$http/.test(url) ? url : `http://localhost:3000${url}`
  console.log("FETCHER url", url)
  return fetch(url).then((r) => r.json())
}

const useToken = (): [string] => {
  const { data: { token } = {} } = useSWRImmutable("/api/jwt", fetcher)
  console.log("USE TOKEN", token)
  return [token]
}

export default useToken

import useSWRImmutable from "swr/immutable"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const useToken = (): [string] => {
  const { data: { token } = {} } = useSWRImmutable("/api/jwt", fetcher)

  return [token]
}

export default useToken

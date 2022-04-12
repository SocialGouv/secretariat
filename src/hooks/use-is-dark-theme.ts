import useSWR from "swr"

const useIsDarkTheme = () => {
  const { data, mutate } = useSWR("is-dark-theme", null)

  return { isDarkTheme: data, setIsDarkTheme: mutate }
}

export default useIsDarkTheme

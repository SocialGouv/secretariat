import useSWR from "swr"
// import useSWRImmutable from "swr/immutable"

const useSearch = () => {
  const { data, mutate } = useSWR("search", null, { fallbackData: "" })

  const setSearch = (search: string): void => {
    mutate(search)
  }

  console.log("useSearch", data)

  return { query: data, mutate: setSearch }
}

export default useSearch

// import { createContext, useState } from "react"

// const useSearch = () => {
//   const [query, setQuery] = useState("")
//   const ReferenceDataContext = createContext({ query, setQuery })

//   // const ReferenceDataContextProvider = ({ children }) => {
//   //   return (
//   //     <ReferenceDataContext.Provider value={{ unicornTypes, setUnicornTypes }}>
//   //       {...children}
//   //     </ReferenceDataContext.Provider>
//   //   );
//   // };
// }
// // export { ReferenceDataContext, ReferenceDataContextProvider };
// export { ReferenceDataContext }

// import { createContext, useContext } from "react"
// export const SearchContext = createContext("")
// export const useSearch = () => useContext(SearchContext)

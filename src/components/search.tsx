import useSearch from "@/services/search"

const Search = () => {
  const { query, mutate } = useSearch()
  // const [search, setSearch] = useState("")

  // const handleChange = (value: string) => {
  // mutate("search", Promise.resolve(value))
  // }

  return (
    <div className="search">
      <input
        type="text"
        name="search"
        value={query}
        // onChange={(e) => console.log(e.target.value)}
        onChange={(e) => mutate(e.target.value)}
        placeholder="recherche par nom ou par email"
      />
    </div>
  )
}

export default Search

import useSearch from "@/services/search"

const Search = () => {
  const { query, mutate } = useSearch()

  return (
    <div className="search">
      <input
        type="text"
        name="search"
        value={query}
        onChange={(e) => mutate(e.target.value)}
        placeholder="recherche par nom ou par email"
      />
    </div>
  )
}

export const StickySearch = () => (
  <div className="sticky top-0 pt-10 z-10 bg-white">
    <Search />
  </div>
)

export default Search

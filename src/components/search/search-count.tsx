import useFilteredUsers from "@/hooks/use-filtered-users"

const SearchCount = () => {
  const { users: filteredUsers } = useFilteredUsers()
  return (
    <div className="counts">
      <strong>{filteredUsers?.length}</strong> comptes utilisateurs
    </div>
  )
}

export default SearchCount

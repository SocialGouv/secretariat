import useFilteredUsers from "@/services/use-filtered-users"

const SearchCount = () => {
  const { users: filteredUsers } = useFilteredUsers()
  return (
    <div className="counts">
      <div>
        <strong>{filteredUsers?.length}</strong> comptes utilisateurs
      </div>
    </div>
  )
}

export default SearchCount

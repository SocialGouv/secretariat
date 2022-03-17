const Badge = ({ label, type }: { label: string; type: string }) => (
  <p className={`badge ${type}`}>{label}</p>
)

export default Badge

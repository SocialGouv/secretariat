const Badge = ({
  label = "",
  title = "",
  type,
}: {
  label?: string
  title?: string
  type: string
}) => (
  <p className={`badge ${type}${label.length ? "" : " icon"}`} title={title}>
    {label}
  </p>
)

export default Badge

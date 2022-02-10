const Loader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => (
  <div className={`loader ${size}`}>
    <div></div>
  </div>
)

export default Loader

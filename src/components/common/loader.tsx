const Loader = ({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) => (
  <div className={`loader ${size}`}>
    <div></div>
  </div>
)

export default Loader

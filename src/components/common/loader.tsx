const Loader = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => (
  <div className="flex flex-1 justify-center items-center">
    <div className={`loader ${size}`}></div>
  </div>
)

export default Loader

const Logo = ({ big = false }: { big?: boolean }) => (
  <div className={`logo${big ? " big" : ""}`}>
    République
    <br />
    Française
  </div>
)

export default Logo

const Alert = ({ message, type }: { message: string; type: string }) => (
  <div className={`alert ${type}`}>
    {type === "info" && <i className="ri-information-fill"></i>}
    {type === "success" && <i className="ri-checkbox-circle-fill"></i>}
    {type === "warning" && <i className="ri-alert-fill"></i>}
    {type === "error" && <i className="ri-close-circle-fill"></i>}
    {message}
  </div>
)

export default Alert

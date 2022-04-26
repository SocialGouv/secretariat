const Alert = ({ message, type }: { message: string; type: string }) => (
  <div className={`alert ${type}`}>
    <div className="icon">
      {type === "info" && <i className="ri-information-fill"></i>}
      {type === "success" && <i className="ri-checkbox-circle-fill"></i>}
      {type === "warning" && <i className="ri-alert-fill"></i>}
      {type === "error" && <i className="ri-close-circle-fill"></i>}
    </div>
    <div className="message">{message}</div>
  </div>
)

export default Alert

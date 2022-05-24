const Alert = ({
  message,
  title,
  type,
}: {
  title?: string
  message: string
  type: "info" | "success" | "warning" | "error"
}) => (
  <div className={`alert ${type}`}>
    <div className="icon">
      {type === "info" && <i className="ri-information-fill"></i>}
      {type === "success" && <i className="ri-checkbox-circle-fill"></i>}
      {type === "warning" && <i className="ri-alert-fill"></i>}
      {type === "error" && <i className="ri-close-circle-fill"></i>}
    </div>
    <div className="body">
      {title && <div className="title">{title}</div>}
      <div className="message">{message}</div>
    </div>
  </div>
)

export default Alert

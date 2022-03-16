const Alert = ({ message }: { message: string }) => (
  <div className="alert">
    <i className="ri-alert-fill"></i>
    <div>{message}</div>
  </div>
)

export default Alert

import { useState } from "react"
import Modal from "react-modal"
import Loader from "../common/loader"

const AccountDeleteModal = ({
  isOpen,
  onConfirm,
  onRequestClose,
}: {
  isOpen: boolean
  onConfirm: () => Promise<{ status: number; body: string }>
  onRequestClose: () => void
}) => {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [response, setResponse] = useState<{ status: number; body: string }>()

  const handleConfirm = async () => {
    setIsConfirmed(true)
    const response = await onConfirm()
    try {
      setResponse({ status: response.status, body: JSON.parse(response.body) })
    } catch {
      setResponse(response)
    }
  }

  const handleRequestClose = () => {
    setIsConfirmed(false)
    setResponse(undefined)
    onRequestClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      className="modal"
      ariaHideApp={false}
      onRequestClose={handleRequestClose}
      contentLabel="Delete account modal"
      overlayClassName="modal-overlay"
    >
      <button className="close" onClick={handleRequestClose}>
        <i className="ri-close-line"></i>
      </button>
      <h2>Révoquer un accès</h2>
      <br />
      {!isConfirmed ? (
        <>
          <p>
            Vous allez supprimer un accès utilisateur sur un outil de la
            Fabrique.
          </p>
          <p>
            Cela sera réellement répercuté sur le service concerné et peut être
            irréversible.
          </p>
          <br />
          <div className="confirm-buttons">
            <button className="secondary" onClick={handleRequestClose}>
              Annuler
            </button>
            <button className="primary" onClick={handleConfirm}>
              Confirmer
            </button>
          </div>
        </>
      ) : !response ? (
        <Loader />
      ) : (
        <>
          <p>Réponse du service :</p>
          <br />
          <pre>{JSON.stringify(response, null, 2)}</pre>
          <div className="close-button">
            <button className="secondary" onClick={handleRequestClose}>
              Fermer
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default AccountDeleteModal

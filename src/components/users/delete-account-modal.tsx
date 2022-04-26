import Modal from "react-modal"

const AccountDeleteModal = ({
  isOpen,
  onConfirm,
  onRequestClose,
}: {
  isOpen: boolean
  onConfirm: () => void
  onRequestClose: () => void
}) => (
  <Modal
    isOpen={isOpen}
    className="modal"
    ariaHideApp={false}
    onRequestClose={onRequestClose}
    contentLabel="Delete account modal"
    overlayClassName="modal-overlay"
  >
    <button className="close" onClick={onRequestClose}>
      <i className="ri-close-line"></i>
    </button>
    <h2>Révoquer un accès</h2>
    <br />
    <p>
      Vous allez supprimer un accès utilisateur sur un outil de la Fabrique.
    </p>
    <p>
      Cela sera réellement répercuté sur le service concerné et peut être
      irréversible.
    </p>
    <br />
    <div className="buttons">
      <button className="secondary" onClick={onRequestClose}>
        Annuler
      </button>
      <button className="primary" onClick={onConfirm}>
        Confirmer
      </button>
    </div>
  </Modal>
)

export default AccountDeleteModal

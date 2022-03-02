import Modal from "react-modal"

import UserTemplate from "@/components/common/user-template"

const ConfirmModal = ({
  isOpen,
  onConfirm,
  droppedUser,
  selectedUser,
  onRequestClose,
}: {
  isOpen: boolean
  droppedUser?: User
  selectedUser?: User
  onConfirm: () => void
  onRequestClose: () => void
}) => (
  <Modal
    isOpen={isOpen}
    ariaHideApp={false}
    onRequestClose={onRequestClose}
    contentLabel="Merge Users Modal"
  >
    <button className="close" onClick={onRequestClose}>
      <i className="ri-close-line"></i>
    </button>
    <h2>Fusionner deux comptes utilisateurs</h2>
    <br />
    <p>
      Permettez-moi de vous suggérez de réfléchir à la conséquence de vos actes.
    </p>
    <p>Etes-vous certain de vouloir faire cela, franchement ?</p>
    <br />
    <br />
    <div className="users">
      {droppedUser && selectedUser && (
        <>
          <UserTemplate user={droppedUser} />
          <i className="ri-arrow-right-line"></i>
          <UserTemplate user={selectedUser} />
        </>
      )}
    </div>
    <br />
    <p>
      Suite à cette opération la référence au compte{" "}
      <strong>{droppedUser?.name}</strong> sera supprimée.
    </p>
    <br />
    <br />
    <div className="buttons">
      <button className="secondary">Je renonce</button>
      <button className="primary" onClick={onConfirm}>
        Allez go !
      </button>
    </div>
  </Modal>
)

export default ConfirmModal

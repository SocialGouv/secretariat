import Modal from "react-modal"
import { toast } from "react-toastify"

const AccountToggleModal = ({
  account,
  isOpen,
  onConfirm,
  onRequestClose,
}: {
  account: AccountToToggle | undefined
  isOpen: boolean
  onConfirm: (
    accountTotoggle: AccountToToggle
  ) => Promise<{ status: number; body: string }>
  onRequestClose: () => void
}) => {
  const handleConfirm = async () => {
    toast.promise(onConfirm(account as AccountToToggle), {
      pending: "En attente",
      success: "Succès",
      error: "Échec",
    })
    onRequestClose()
  }

  const handleRequestClose = () => {
    onRequestClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      className="modal"
      ariaHideApp={false}
      onRequestClose={handleRequestClose}
      contentLabel="Toggle account modal"
      overlayClassName="modal-overlay"
    >
      <button className="close" onClick={handleRequestClose}>
        <i className="ri-close-line"></i>
      </button>
      <h2>{account?.disable ? "Désactiver" : "Activer"} un accès</h2>
      <br />
      <p>
        Vous allez {account?.disable ? "désactiver" : "activer"} un accès
        utilisateur sur un outil de la Fabrique.
      </p>
      <br />
      {account?.disable && account?.account.type === "ovh" ? (
        <p>
          La désactivation d&apos;un compte OVH consiste à{" "}
          <b>changer le mot de passe</b> du compte de manière à ce que
          l&apos;utilisateur ne le connaisse plus. La réactivation consiste à
          changer de nouveau le mot de passe et à l&apos;envoyer par email à
          l&apos;utilisateur. Si l&apos;<b>email</b> de l&apos;utilisateur{" "}
          <b>n&apos;est pas connu</b>, la <b>réactivation</b> par Secrétariat{" "}
          <b>est impossible</b>.
        </p>
      ) : (
        <p>Cela sera répercuté sur le service concerné.</p>
      )}
      <br />
      <div className="confirm-buttons">
        <button className="secondary" onClick={handleRequestClose}>
          Annuler
        </button>
        <button className="primary" onClick={handleConfirm}>
          Confirmer
        </button>
      </div>
    </Modal>
  )
}

export default AccountToggleModal

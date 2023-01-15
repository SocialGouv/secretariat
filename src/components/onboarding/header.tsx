const OnboardingHeader = ({ text }: { text?: string }) => (
  <div className="onboarding-header">
    {/* <div className="icon">🛳️</div> */}
    <i className="ri-ship-line ri-5x text-blue-france-113-main leading-10 mr-6" />
    <div>
      <h2>Embarquement à la Fabrique Numérique des Ministères Sociaux</h2>
      <p className="text">
        {text ||
          "Remplissez le formulaire suivant afin d'effectuer une demande d'embarquement à la Fabrique Numérique des Ministères Sociaux."}
      </p>
    </div>
  </div>
)

export default OnboardingHeader

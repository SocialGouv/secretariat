import { useEffect, useState } from "react"

import Stepper from "./stepper"

export type Status = "loading" | "success" | "failure" | "steps"

const Wizard = ({
  data,
  steps,
  onComplete,
  editable = true,
}: {
  editable?: boolean
  steps: WizardStep[]
  data: OnboardingData | undefined
  onComplete: (post: OnboardingData | undefined) => void
}) => {
  const [isValidStep, setValidStep] = useState(false)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [fields, setFields] = useState<OnboardingData | undefined>(data)

  const { component: Step } = steps[activeStepIndex]
  const isLastStep = activeStepIndex === steps.length - 1

  useEffect(() => setFields(data), [data])

  // const handleChange = (name: string, value: string) => {
  //   setFields({ ...fields, [name]: value })
  // }

  const PreviousButton = ({ activeStepIndex }: { activeStepIndex: number }) => (
    <button
      className="primary flex"
      onClick={(e) => {
        e.preventDefault()
        setValidStep(false)
        setActiveStepIndex(activeStepIndex - 1)
      }}
    >
      <i className="ri-arrow-left-s-line ri-xl relative right-2" />
      Précédent
    </button>
  )

  // const NextButton = ({
  //   isLastStep,
  //   activeStepIndex,
  //   isDisabled = false,
  // }: {
  //   isLastStep: boolean
  //   isDisabled?: boolean
  //   activeStepIndex: number
  // }) => (
  //   <button
  //     disabled={isDisabled}
  //     className="primary flex"
  //     onClick={(e) => {
  //       e.preventDefault()
  //       setValidStep(false)
  //       setActiveStepIndex(activeStepIndex + 1)
  //       if (isLastStep) onComplete(fields)
  //     }}
  //   >
  //     {isLastStep ? "Terminer" : "Suivant"}
  //     {isLastStep ? (
  //       <i className="ri-check-line ri-xl relative left-1" />
  //     ) : (
  //       <i className="ri-arrow-right-s-line ri-xl relative left-2" />
  //     )}
  //   </button>
  // )

  const NextButton = ({
    activeStepIndex,
    isDisabled = false,
  }: {
    isDisabled?: boolean
    activeStepIndex: number
  }) => (
    <button
      disabled={isDisabled}
      className="primary flex"
      onClick={(e) => {
        e.preventDefault()
        setValidStep(false)
        setActiveStepIndex(activeStepIndex + 1)
      }}
    >
      Suivant
      <i className="ri-arrow-right-s-line ri-xl relative left-2" />
    </button>
  )

  const SubmitButton = () => (
    <button
      className="primary flex"
      onClick={(e) => {
        e.preventDefault()
        // setValidStep(false)
        // setActiveStepIndex(activeStepIndex + 1)
        onComplete(fields)
      }}
    >
      Terminer
      <i className="ri-check-line ri-xl relative left-1" />
    </button>
  )

  return (
    <div className="wizard">
      <Stepper activeStepIndex={activeStepIndex} steps={steps} />
      <div className="steps">
        <Step onValidate={setValidStep} />
        <div
          className={`actions justify-${activeStepIndex ? "between" : "end"}`}
        >
          {activeStepIndex > 0 && (
            <PreviousButton activeStepIndex={activeStepIndex} />
          )}
          {!isLastStep && (
            <NextButton
              isDisabled={!isValidStep}
              activeStepIndex={activeStepIndex}
            />
          )}
          {isLastStep && editable && <SubmitButton />}
        </div>
      </div>
    </div>
  )
}

export default Wizard

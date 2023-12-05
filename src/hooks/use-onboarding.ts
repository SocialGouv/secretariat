import { add } from "date-fns"
import type { KeyedMutator } from "swr"

import useSWR from "swr"

import useOnboardingRequest from "./use-onboarding-request"

const defaultData = {
  email: "",
  message: "",
  lastName: "",
  firstName: "",
  githubLogin: "",
  services: { mattermost: true, ovh: false },
  arrival: new Date().toLocaleDateString("en-CA"),
  departure: add(new Date(), { months: 3 }).toLocaleDateString("en-CA"),
} as OnboardingData

const useOnboarding = () => {
  const { request, id } = useOnboardingRequest()

  const key = id ? `onboarding-${id}` : "onboarding"
  const fallbackData = id ? request?.data : defaultData

  const {
    data,
    mutate,
  }: { data?: OnboardingData; mutate: KeyedMutator<OnboardingData> } = useSWR(
    key,
    null,
    { fallbackData }
  )

  return { data, mutate, request, id }
}

export default useOnboarding

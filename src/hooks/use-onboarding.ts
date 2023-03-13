import { add } from "date-fns"
import type { KeyedMutator } from "swr"

import useSWR from "swr"

import useOnboardingRequest from "./use-onboarding-request"

export const fallbackData = {
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

  const {
    data,
    mutate,
  }: { data?: OnboardingData; mutate: KeyedMutator<unknown> } = useSWR(
    "onboarding",
    null,
    {
      fallbackData: request?.data || fallbackData,
    }
  )

  return { data, mutate, request, id }
}

export default useOnboarding

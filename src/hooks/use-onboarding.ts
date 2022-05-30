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
  departure: new Date().toLocaleDateString("en-CA"),
} as OnboardingData

const useOnboarding = () => {
  const { request } = useOnboardingRequest()

  const { data, mutate }: { data?: OnboardingData; mutate: KeyedMutator<any> } =
    useSWR("onboarding", null, {
      fallbackData: request?.data || fallbackData,
    })

  return { data, mutate, request }
}

export default useOnboarding

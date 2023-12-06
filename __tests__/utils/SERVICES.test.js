import SERVICES from "@/utils/SERVICES"
import { it, expect } from "vitest"

it("should return a list of known services", () => {
  expect(
    [
      "github",
      "matomo",
      "mattermost",
      "nextcloud",
      "ovh",
      "sentry",
      "zammad",
    ].sort()
  ).toEqual(expect.arrayContaining(SERVICES.sort()))
})

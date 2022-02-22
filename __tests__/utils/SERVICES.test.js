import SERVICES from "@/utils/SERVICES"

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

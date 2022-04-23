import { render } from "@testing-library/react"

import Index from "../src/pages/index"

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react")

  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: {
      role: "user",
      name: "John Doe",
      login: "john-doe",
      email: "john.doe@paradise.sky",
      image: "https://avatars.githubusercontent.com/u/59922165?v=4",
      teams: ["core-team", "fabrique", "sre", "covid-19", "admins-secretariat"],
    },
  }

  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => ({ data: mockSession, status: "authenticated" })),
  }
})

it("renders homepage", () => {
  const { container } = render(<Index />)
  expect(container).toMatchSnapshot()
})

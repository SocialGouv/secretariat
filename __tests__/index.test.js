import { render } from "@testing-library/react"
import { useSession } from "next-auth/react"

import Index from "../src/pages/index"

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

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react")

  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => ({
      data: mockSession,
      status: "authenticated",
    })),
  }
})

describe("when index page renders", () => {
  it("displays a loader if session is undefined", () => {
    useSession.mockImplementation(() => [false, false])
    const { container } = render(<Index />)
    expect(container).toMatchSnapshot()
  })

  it("displays login form if session is null", () => {
    useSession.mockImplementation(() => ({
      data: null,
      status: "unauthenticated",
    }))
    const { container } = render(<Index />)
    expect(container).toMatchSnapshot()
  })

  it("displays users list if session is valid", () => {
    useSession.mockImplementation(() => ({
      data: mockSession,
      status: "authenticated",
    }))
    const { container } = render(<Index />)
    expect(container).toMatchSnapshot()
  })
})

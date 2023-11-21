import { DndProvider } from "react-dnd"
import { useSession } from "next-auth/react"
import { HTML5Backend } from "react-dnd-html5-backend"
import { render, waitFor } from "@testing-library/react"

import UserProfile from "../../src/components/users/user-profile"

import { vi, it, expect } from "vitest"

// https://github.com/nextauthjs/next-auth/issues/775
vi.mock("next-auth/react", () => ({ useSession: vi.fn() }))

const user = {
  id: "1",
  name: "user1",
  updated_at: "",
  email: "user1@paradise.sky",
  warnings: [],
  services: [
    {
      id: "11",
      type: "nextcloud",
      data: {
        lastLogin: "",
        displayname: "User 1",
        email: "user1@paradise.sky",
      },
    },
  ],
}

it("renders user profile", async () => {
  useSession.mockReturnValueOnce([false, false])
  const { container } = render(
    <DndProvider backend={HTML5Backend}>
      <UserProfile user={user} />
    </DndProvider>
  )
  await waitFor(() => {
    expect(container).toMatchSnapshot()
  })
})

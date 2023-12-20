import sluggifyString from "@/utils/sluggify-string"
import { it, expect } from "vitest"

it("should keep only lowercase and '-'", () => {
  expect(sluggifyString('hél#lö (d)\'wórld "123"_456.xyz')).toBe(
    "hello-dworld-xyz"
  )
})

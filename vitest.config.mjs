/// <reference types="vitest" />

import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), stubNextAssetImport()],
  test: {
    environment: "jsdom",
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
    setupFiles: "vitest.setup.js",
    clearMocks: true,
  },
})

function stubNextAssetImport() {
  return {
    name: "stub-next-asset-import",
    transform(_code, id) {
      if (/(jpg|jpeg|png|webp|gif|svg)$/.test(id)) {
        const imgSrc = path.relative(process.cwd(), id)
        return {
          code: `export default { src: '/${imgSrc}', height: 1, width: 1 }`,
        }
      }
    },
  }
}

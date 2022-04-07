// jest.config.js
const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias" to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "@/hooks/(.*)": "<rootDir>/src/hooks/$1",
    "@/utils/(.*)": "<rootDir>/src/utils/$1",
    "@/styles/(.*)": "<rootDir>/src/styles/$1",
    "@/queries/(.*)": "<rootDir>/src/queries/$1",
    "@/services/(.*)": "<rootDir>/src/services/$1",
    "@/components/(.*)": "<rootDir>/src/components/$1",
  },
  // does not work yet according to https://github.com/vercel/next.js/issues/35634
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(react-dnd|dnd-core|react-dnd-html5-backend)/)"
  ]
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)

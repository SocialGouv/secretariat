const { version } = require("./package.json")

const commitSha = process.env.CI_COMMIT_SHA || "dev"

module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com", "secure.gravatar.com"],
  },
  experimental: {
    outputStandalone: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_APP_VERSION_COMMIT: commitSha,
  },
}

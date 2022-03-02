const { version } = require("./package.json")

const commitSha = process.env.CI_COMMIT_SHA || "dev"

module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["avatars.githubusercontent.com", "secure.gravatar.com"],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    outputStandalone: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_APP_VERSION_COMMIT: commitSha,
  },
}

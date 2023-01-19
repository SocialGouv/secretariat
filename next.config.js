const path = require("path")
const { randomBytes } = require("crypto")
const { version, homepage } = require("./package.json")

const nonce = randomBytes(8).toString("base64")
process.env.NONCE = nonce
const commitSha = process.env.GITHUB_SHA || "dev"

const ContentSecurityPolicy =
  process.env.NODE_ENV === "production"
    ? `
      default-src 'self';
      font-src 'self';
      base-uri 'self';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      script-src 'self' 'nonce-${nonce}' 'unsafe-inline';
      connect-src 'self' api.github.com matomo.fabrique.social.gouv.fr ${process.env.NEXT_PUBLIC_HASURA_URL};
    `
    : `
      default-src 'self';
      font-src 'self';
      img-src 'self' data:;
      style-src 'self' 'unsafe-inline';
      connect-src 'self' localhost:8080 api.github.com matomo.fabrique.social.gouv.fr;
      script-src 'self' 'nonce-${nonce}' 'unsafe-eval';
    `

const securityHeaders = [
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
]

module.exports = {
  swcMinify: true,
  optimizeFonts: false,
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["avatars.githubusercontent.com", "secure.gravatar.com"],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    outputStandalone: true,
    // images: {
    //   layoutRaw: true,
    // },
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_APP_VERSION_COMMIT: commitSha,
    NEXT_PUBLIC_APP_REPOSITORY_URL: homepage,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src", "styles")],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
}

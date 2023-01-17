const path = require("path")
const { randomBytes } = require("crypto")
const { version, homepage } = require("./package.json")

const nonce = randomBytes(8).toString("base64")
process.env.NONCE = nonce
const commitSha = process.env.GITHUB_SHA || "dev"

const ContentSecurityPolicy =
  process.env.NODE_ENV === "production"
    ? `
      font-src 'self';
      base-uri 'self';
      default-src 'self';
      img-src 'self' data:;
      style-src 'self' 'unsafe-inline';
      connect-src 'self' api.github.com ${process.env.NEXT_PUBLIC_HASURA_URL};
      script-src 'self' 'nonce-${nonce}' 'unsafe-inline' matomo.fabrique.social.gouv.fr;
    `
    : `
      font-src 'self';
      default-src 'self';
      img-src 'self' data:;
      style-src 'self' 'unsafe-inline';
      connect-src 'self' localhost:8080 api.github.com;
      script-src 'self' 'nonce-${nonce}' 'unsafe-eval' matomo.fabrique.social.gouv.fr;
    `

const securityHeaders = [
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

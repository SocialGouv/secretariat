// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require("@sentry/nextjs")

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
      object-src 'none';
      base-uri 'none';
      require-trusted-types-for 'script';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' matomo.fabrique.social.gouv.fr;
      connect-src 'self' api.github.com matomo.fabrique.social.gouv.fr ${process.env.NEXT_PUBLIC_HASURA_URL} sentry.fabrique.social.gouv.fr;
    `
    : `
      default-src 'self';
      object-src 'none';
      base-uri 'none';
      require-trusted-types-for 'script';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      script-src 'self' 'unsafe-eval';
      connect-src 'self' localhost:8080 api.github.com matomo.fabrique.social.gouv.fr sentry.fabrique.social.gouv.fr;
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
  sentry: {
    hideSourceMaps: true,
    disableClientWebpackPlugin: true,
    disableServerWebpackPlugin: true,
  },
  experimental: {
    outputStandalone: true,
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

module.exports = withSentryConfig(module.exports, { silent: true })

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

const ContentSecurityPolicy =
  process.env.NODE_ENV === "production"
    ? `
      default-src 'self';
      report-uri /api/report;
      report-to endpoint;
      object-src 'none';
      base-uri 'none';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: authjs.dev;
      script-src 'nonce-${nonce}' 'strict-dynamic';
      connect-src 'self' api.github.com matomo.fabrique.social.gouv.fr ${process.env.NEXT_PUBLIC_HASURA_URL} sentry.fabrique.social.gouv.fr;
    `
    : `
      default-src 'self';
      object-src 'none';
      base-uri 'none';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: authjs.dev;
      script-src 'self' 'unsafe-eval';
      connect-src 'self' localhost:8080 api.github.com matomo.fabrique.social.gouv.fr sentry.fabrique.social.gouv.fr;
    `

const headers = [
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
  { key: "Reporting-Endpoints", value: "endpoint=/api/report" },
]

const nextConfig = {
  swcMinify: true,
  optimizeFonts: false,
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["avatars.githubusercontent.com", "secure.gravatar.com"],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  output: "standalone",
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_APP_REPOSITORY_URL: homepage,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src", "styles")],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers,
      },
    ]
  },
}

const sentryWebpackPluginOptions = {
  org: "incubateur",
  project: "secretariat",
  url: "https://sentry.fabrique.social.gouv.fr/",
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
}

const sentryOptions = {
  widenClientFileUpload: true,
  hideSourceMaps: true,
}

module.exports = withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions,
  sentryOptions
)

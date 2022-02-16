import Image from "next/image"

const ratio = 1.143

const sizes: Record<string, Record<string, number>> = {
  s: { width: 16 * ratio, height: 16 },
  m: { width: 18 * ratio, height: 18 },
  l: { width: 24 * ratio, height: 24 },
}

const SentryLogo = ({ size = "m" }: { size?: string }) => (
  <Image
    title="sentry"
    alt="sentry logo"
    width={sizes[size].width}
    src={"/images/sentry.png"}
    height={sizes[size].height}
  />
)

export default SentryLogo

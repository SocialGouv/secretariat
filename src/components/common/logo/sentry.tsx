import Image from "next/image"

const ratio = 1.143

const sizes: Record<string, Record<string, number>> = {
  s: { width: 16 * ratio, height: 16 },
  m: { width: 22 * ratio, height: 22 },
  l: { width: 32 * ratio, height: 32 },
}

const SentryLogo = ({ size = "m" }: { size?: string }) => (
  <Image
    title="sentry"
    alt="sentry logo"
    width={sizes[size].width}
    src={"/images/sentry.svg"}
    height={sizes[size].height}
  />
)

export default SentryLogo

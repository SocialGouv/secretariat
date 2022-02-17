import Image from "next/image"

const ratio = 1.454

const sizes: Record<string, Record<string, number>> = {
  s: { width: 16 * ratio, height: 16 },
  m: { width: 22 * ratio, height: 22 },
  l: { width: 32 * ratio, height: 32 },
}

const MatomoLogo = ({ size = "m" }: { size?: string }) => (
  <Image
    title="matomo"
    alt="matomo logo"
    width={sizes[size].width}
    src={"/images/matomo.svg"}
    height={sizes[size].height}
  />
)

export default MatomoLogo

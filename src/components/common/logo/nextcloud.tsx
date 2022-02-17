import Image from "next/image"

const ratio = 1

const sizes: Record<string, Record<string, number>> = {
  s: { width: 16 * ratio, height: 16 },
  m: { width: 18 * ratio, height: 18 },
  l: { width: 24 * ratio, height: 24 },
}

const NextCloudLogo = ({ size = "m" }: { size?: string }) => (
  <Image
    title="nextcloud"
    alt="nextcloud logo"
    width={sizes[size].width}
    src={"/images/nextcloud.png"}
    height={sizes[size].height}
  />
)

export default NextCloudLogo

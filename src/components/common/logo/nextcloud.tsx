import Image from "next/image"

const ratio = 2.064

const sizes: Record<string, Record<string, number>> = {
  s: { width: 16 * ratio, height: 16 },
  m: { width: 22 * ratio, height: 22 },
  l: { width: 32 * ratio, height: 32 },
}

const NextCloudLogo = ({ size = "m" }: { size?: string }) => (
  <Image
    title="nextcloud"
    alt="nextcloud logo"
    width={sizes[size].width}
    height={sizes[size].height}
    src={"/images/nextcloud.svg"}
  />
)

export default NextCloudLogo

import Image from "next/image"

const ratio = 1.684

const sizes: Record<string, Record<string, number>> = {
  s: { width: 12 * ratio, height: 12 },
  m: { width: 16 * ratio, height: 16 },
  l: { width: 24 * ratio, height: 24 },
}

const OVHLogo = ({ size = "m" }: { size?: string }) => (
  <Image
    title="OVH"
    alt="ovh logo"
    src={"/images/ovh.svg"}
    width={sizes[size].width}
    height={sizes[size].height}
  />
)

export default OVHLogo

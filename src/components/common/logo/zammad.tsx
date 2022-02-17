import Image from "next/image"

const ratio = 1.166

const sizes: Record<string, Record<string, number>> = {
  s: { width: 16 * ratio, height: 16 },
  m: { width: 22 * ratio, height: 22 },
  l: { width: 32 * ratio, height: 32 },
}

const ZammadLogo = ({ size = "m" }: { size?: string }) => (
  <Image
    title="zammad"
    alt="zammad logo"
    width={sizes[size].width}
    height={sizes[size].height}
    src={"/images/zammad.svg#icon-logo"}
  />
)

export default ZammadLogo

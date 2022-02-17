import Image from "next/image"

const sizes: Record<string, Record<string, number>> = {
  s: { width: 16, height: 16 },
  m: { width: 22, height: 22 },
  l: { width: 32, height: 32 },
}

const MattermostLogo = ({ size = "m" }: { size?: string }) => (
  <Image
    alt="mattermost logo"
    width={sizes[size].width}
    height={sizes[size].height}
    src={"/images/mattermost.svg"}
  />
)

export default MattermostLogo

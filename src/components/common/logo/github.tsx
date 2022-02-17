import Image from "next/image"

const sizes: Record<string, Record<string, number>> = {
  s: { width: 16, height: 16 },
  m: { width: 22, height: 22 },
  l: { width: 32, height: 32 },
}

const GithubLogo = ({ size = "m" }: { size?: string }) => (
  <Image
    alt="github logo"
    width={sizes[size].width}
    src={"/images/github.svg"}
    height={sizes[size].height}
  />
)

export default GithubLogo

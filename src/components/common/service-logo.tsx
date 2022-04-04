import Image from "next/image"

const ratios = {
  github: 1,
  matomo: 1.454,
  sentry: 1.143,
  mattermost: 1,
  zammad: 1.166,
  nextcloud: 2.064,
  ovh: 1.684,
}

const sizes: Record<string, number> = {
  sm: 18,
  md: 22,
  lg: 24,
}

const ServiceLogo = ({
  name,
  size = "md",
}: {
  name: ServiceName
  size?: "sm" | "md" | "lg"
}) => (
  <Image
    title={name}
    height={sizes[size]}
    alt={`${name} logo`}
    width={sizes[size] * ratios[name]}
    src={`/images/${name}.svg#icon-logo`}
  />
)

export default ServiceLogo

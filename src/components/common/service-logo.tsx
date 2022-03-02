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
  sm: 16,
  md: 22,
  lg: 24,
}

const ServiceLogo = ({
  service,
  size = "md",
}: {
  service: ServiceName
  size?: "sm" | "md" | "lg"
}) => (
  <Image
    title={service}
    height={sizes[size]}
    alt={`${service} logo`}
    width={sizes[size] * ratios[service]}
    src={`/images/${service}.svg#icon-logo`}
  />
)

export default ServiceLogo

import useIsDarkTheme from "@/hooks/use-is-dark-theme"
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
  xl: 32,
  "2xl": 48,
}

const ServiceLogo = ({
  name,
  size = "md",
  disabled = false,
}: {
  name: ServiceName
  disabled: boolean
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
}) => {
  const { isDarkTheme } = useIsDarkTheme()

  return (
    <Image
      title={name}
      height={sizes[size]}
      alt={`${name} logo`}
      width={sizes[size] * ratios[name]}
      className={disabled ? "opacity-25 dark:opacity-40" : ""}
      src={`/images/${isDarkTheme ? "light" : "dark"}/${name}.svg#icon-logo`}
    />
  )
}

export default ServiceLogo

import Link from "next/link"
import { useRouter } from "next/router"

const Navigation = () => {
  const router = useRouter()
  const { route } = router

  const links = [
    { route: "/accounts", text: "Gestion des comptes", icon: "ri-user-3-line" },
    {
      route: "/onboarding-requests",
      text: "Demandes d'embarquement",
      icon: "ri-ship-line",
    },
    {
      route: "/logs",
      text: "Journal des actions",
      icon: "ri-file-list-3-line",
    },
  ]

  return (
    <div className="navigation">
      <ul>
        {links.map((link, i) => (
          <li key={i}>
            <Link href={link.route}>
              <a className={route === link.route ? "selected" : ""}>
                <i
                  className={`${link.icon} text-xl leading-none align-sub mr-1`}
                />
                {link.text}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Navigation

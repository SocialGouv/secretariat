import Header from "@/components/header"
import Footer from "@/components/footer"
import { useSession } from "next-auth/react"

export default function Layout({ children }: { children: JSX.Element }) {
  const { data: session } = useSession()

  return (
    <>
      <Header />
      <div className={`page${session ? " authenticated" : ""}`}>
        {children}
        <Footer />
      </div>
    </>
  )
}

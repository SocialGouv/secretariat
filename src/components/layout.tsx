import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <>
      <Header />
      <div className="page">
        {children}
        <Footer />
      </div>
    </>
  )
}

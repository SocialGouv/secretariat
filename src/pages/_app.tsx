import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"

import Header from "@/components/header"
import Footer from "@/components/footer"

import "remixicon/fonts/remixicon.css"
import "@/styles/tailwind.scss"
import "@/styles/globals.scss"
import { useEffect } from "react"

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    document.title = "Secrétariat"
  }, [])

  return (
    <SessionProvider session={session}>
      <Header />
      <div className="page">
        <Component {...pageProps} />
        <Footer />
      </div>
    </SessionProvider>
  )
}

export default App

import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"

import Header from "@/components/header"

import "@/styles/tailwind.scss"
import "@/styles/globals.scss"

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <div className="page">
        <Component {...pageProps} />
        {/* <Footer /> */}
      </div>
    </SessionProvider>
  )
}

export default App
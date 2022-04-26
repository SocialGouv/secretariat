import type { AppProps } from "next/app"
import { SessionProvider } from "next-auth/react"

import Layout from "@/components/layout"

import "@/styles/tailwind.scss"
import "@/styles/globals.scss"

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default App

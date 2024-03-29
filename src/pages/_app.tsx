import { useEffect } from "react"
import type { AppProps } from "next/app"
import { init } from "@socialgouv/matomo-next"
import { SessionProvider } from "next-auth/react"
import { Session } from "next-auth"

import Layout from "@/components/layout"

import "@/styles/tailwind.scss"
import "@/styles/globals.scss"
import { ToastProvider } from "@/components/common/toast-provider"

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL || ""
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID || ""

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  useEffect(() => {
    init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID })
  }, [])

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ToastProvider />
    </SessionProvider>
  )
}

export default App

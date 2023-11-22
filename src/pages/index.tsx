import Head from "next/head"

import Home from "@/components/home"

const Index = () => (
  <main className="flex flex-col pt-12 gap-12">
    <Head>
      <title>Secrétariat</title>
    </Head>
    <Home />
    <button
      className="primary"
      onClick={() => {
        throw new Error("manual fail")
      }}
    >
      Fail
    </button>
  </main>
)

export default Index

import Head from "next/head"

import Home from "@/components/home"

const Index = () => (
  <main className="flex flex-col pt-12 gap-12">
    <Head>
      <title>Secrétariat</title>
    </Head>
    <button
      onClick={() => {
        throw new Error("client error")
      }}
    >
      ERROR
    </button>
    <Home />
  </main>
)

export default Index

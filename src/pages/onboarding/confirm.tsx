import Head from "next/head"

import Alert from "@/components/common/alert"

const Confirm = () => (
  <main className="flex items-center justify-center">
    <Head>
      <title>Secrétariat</title>
    </Head>
    <Alert
      type="info"
      message="Votre requête a été soumise à un administrateur pour revue."
    />
  </main>
)

export default Confirm

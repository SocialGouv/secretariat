import Footer from "@/components/footer"
import Head from "next/head"

const Legal = () => {
  return (
    <main className="mt-10">
      <Head>
        <title>Secrétariat</title>
      </Head>

      <h1 className="text-center text-3xl">Mentions légales</h1>
      <br />
      <h2>Editeur de la Plateforme</h2>
      <p>
        La Plateforme est éditée par la Fabrique numérique des ministères
        sociaux, située :
      </p>
      <br />
      <p>
        Tour Mirabeau
        <br />
        39-43 quai André-Citroën
        <br />
        75739 Paris Cedex 15
        <br />
        France
      </p>
      <br />
      <p>Téléphone : 01 44 38 36 02</p>
      <br />
      <h2>Directrice de la publication</h2>
      <p>
        Madame Anne JEANJEAN, Directrice du numérique des ministères sociaux.
      </p>
      <br />
      <h2>Hébergement de la Plateforme</h2>
      <p>Cette plateforme est hébergée par :</p>
      <br />
      <p>
        OVH SAS
        <br />2 rue Kellermann
        <br />
        59100 Roubaix
        <br />
        France
      </p>
      <br />

      <Footer />
    </main>
  )
}

export default Legal

import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="fr">
      <Head nonce={process.env.NONCE}>
        <meta
          name="description"
          content="Site de gestion des comptes de services des utilisateurs de la Fabrique Numérique des Ministères Sociaux."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

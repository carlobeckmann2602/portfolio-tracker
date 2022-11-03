import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>My page title</title>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />

      <link rel="icon" type="image/png" sizes="144x144" href="icon-144.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="icon-512.png" />
      <link rel="apple-touch-icon" href="/icon-512.png"></link>

      <meta
        name='viewport'
        content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
      />
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp

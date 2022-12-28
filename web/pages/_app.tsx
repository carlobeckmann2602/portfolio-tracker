import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { BackendApiProvider } from "../lib/backend";
import { Footer } from "../components/footer";
import { LogoutButton } from "../components/logout-button";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#180A44" />

        <link rel="icon" type="image/png" sizes="144x144" href="icon-144.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="icon-512.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <BackendApiProvider>
        <LogoutButton />
        <Component {...pageProps} />
        <Footer />
      </BackendApiProvider>
      <div
        id="modal-portal"
        className="fixed inset-0 pointer-events-none"
      ></div>
    </>
  );
}

export default MyApp;

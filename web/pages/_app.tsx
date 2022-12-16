import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { BackendApiProvider, AuthContextProvider } from "../lib/backend";
import { useEffect, useState } from "react";
import { Footer } from "../components/footer";

function MyApp({ Component, pageProps }: AppProps) {
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    setUserID(localStorage.getItem("userID"));
  }, []);

  useEffect(() => {
    if (userID) {
      localStorage.setItem("userID", userID);
    }
  }, [userID]);

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
        <AuthContextProvider value={[userID, setUserID]}>
          <Component {...pageProps} />
          <Footer />
        </AuthContextProvider>
      </BackendApiProvider>
      <div
        id="modal-portal"
        className="fixed inset-0 pointer-events-none"
      ></div>
    </>
  );
}

export default MyApp;

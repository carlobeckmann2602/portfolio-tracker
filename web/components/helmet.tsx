import Head from "next/head";
import React from "react";

const siteTitle = "Stonks";

export function Helmet({ title }: { title?: string }) {
  return (
    <Head>
      <title>
        {title && `${title} – `}
        {siteTitle}
      </title>
    </Head>
  );
}

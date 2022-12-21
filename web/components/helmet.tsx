import Head from "next/head";
import React from "react";

const siteTitle = "GoFundYourself";

export function Helmet({ title }: { title?: string }) {
  return (
    <Head>
      <title>{title ? `${title} – ${siteTitle}` : siteTitle}</title>
    </Head>
  );
}

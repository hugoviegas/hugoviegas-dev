import type { AppProps } from "next/app";
import { SpeedInsights } from "@vercel/speed-insights/next";
import React from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {/* Add Speed Insights collector */}
      <SpeedInsights />
    </>
  );
}

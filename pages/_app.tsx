import { SpeedInsights } from "@vercel/speed-insights/next";
import React from "react";
import { Analytics } from "@vercel/analytics/react";

type AppProps = {
  Component: React.ComponentType<Record<string, unknown>>;
  pageProps: Record<string, unknown>;
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {/* Vercel Web Analytics collector */}
      <Analytics />
      {/* Add Speed Insights collector */}
      <SpeedInsights />
    </>
  );
}

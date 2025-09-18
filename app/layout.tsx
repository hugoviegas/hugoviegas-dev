/** @format */

import { SpeedInsights } from "@vercel/speed-insights/next";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {/* Add Speed Insights collector */}
        <SpeedInsights />
      </body>
    </html>
  );
}

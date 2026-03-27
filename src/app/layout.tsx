import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Company Enrichment Demo | Exa Deep Search",
  description: "Enrich company data for your CRM using Exa Deep Search with structured output",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

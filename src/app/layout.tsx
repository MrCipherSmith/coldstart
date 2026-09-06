import type { Metadata, Viewport } from "next";
import { BOOT_SCRIPT } from "@/lib/chrome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mrciphersmith.com"),
  title: "COLD START — MrCipherSmith",
  description:
    "An agent opens your repository and knows nothing about it. Five answers to that, each one a layer deeper — ending in a versioned project brain and a runtime with a kernel underneath it.",
  openGraph: {
    title: "COLD START — MrCipherSmith",
    description:
      "Five answers to one question: where does an AI agent's context live? A descent, layer by layer, into a repository that remembers.",
    url: "https://mrciphersmith.com",
    siteName: "MrCipherSmith",
    type: "website",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050507" },
    { media: "(prefers-color-scheme: light)", color: "#f4f4f1" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-lang="en" data-theme="dark" data-ctx="on">
      <head>
        {/* Restores theme and language before first paint, so neither flashes. */}
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

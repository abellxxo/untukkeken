import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Untuk Keken",
  description: "Where it all began.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", // Fix: "default" bikin status bar putih, nutup konten
    title: "Untuk Keken",
  },
  // Menambahkan fallback modern untuk browser selain Safari
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  themeColor: "#3b13b0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Sisakan icon saja, meta tag PWA sudah otomatis di-handle oleh Next.js dari object metadata di atas */}
        <link rel="icon" type="image/png" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
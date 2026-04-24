import Providers from "./providers";

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
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              -webkit-touch-callout: none; /* Hilangin popup menu iOS */
              -webkit-user-select: none;   /* Safari/Chrome mobile */
              user-select: none;           /* Standard */
            }
            input, textarea {
              -webkit-user-select: auto;   /* Balikin biar form login tetap bisa diketik/select text */
              user-select: auto;
            }
          `
        }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
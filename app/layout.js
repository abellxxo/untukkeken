import Providers from "./providers";

export const metadata = {
  title: "Our Memories",
  description: "Anniversary gift for Kenisha",
  manifest: "/manifest.json", // Ini yang manggil file PWA-nya
  themeColor: "#3b13b0",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Our Memories",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
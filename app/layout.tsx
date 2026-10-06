import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RONA — Wallpaper Discovery",
  description: "Temukan wallpaper pilihan dari kata kunci favoritmu. Cari, jelajahi, dan simpan suasana baru untuk layar kamu.",
  applicationName: "RONA Wallpaper Studio",
  openGraph: {
    title: "RONA — Wallpaper Discovery",
    description: "Satu kata kunci, banyak suasana. Temukan wallpaper favoritmu.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

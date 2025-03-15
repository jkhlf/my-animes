import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "AnimeTracker - Track Your Anime Journey",
  description: "A comprehensive anime tracking application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${inter.className} antialiased bg-slate-500`}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitShame 🔥 Brutally Honest GitHub Profile Roaster",
  description:
    "The AI that roasts your GitHub commit sins, 3 AM panic pushes, and 14 abandoned repositories. Download collectible shame cards and battle your friends.",
  keywords: [
    "git roast",
    "github profile roaster",
    "gitshame",
    "developer humor",
    "roast my repo",
    "commit history",
    "programmer humor",
  ],
  authors: [{ name: "GitShame" }],
  openGraph: {
    title: "GitShame 🔥 Brutally Honest GitHub Profile Roaster",
    description:
      "Find out your developer shame score, cursed commit sins, and psychological coding profile.",
    url: "https://gitshame.dev",
    siteName: "GitShame",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitShame 🔥 Brutally Honest GitHub Profile Roaster",
    description: "The AI that roasts your GitHub commit sins and 3 AM panic pushes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}


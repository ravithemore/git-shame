import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitShame 🔥 The Future of Code Review is Brutal + Honest",
  description:
    "Connect any GitHub repository or handle to uncover 3 AM panic pushes, ghost commits, and receive an unfiltered AI roast dossier with collectible shame receipts.",
  keywords: [
    "git shame",
    "roast my repo",
    "github profile roaster",
    "developer humor",
    "code review",
  ],
  openGraph: {
    title: "GitShame 🔥 Brutal + Honest Code Review",
    description: "Uncover 3 AM panic pushes and get an unfiltered AI roast dossier.",
    url: "https://gitshame.dev",
    siteName: "GitShame",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-background font-body text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

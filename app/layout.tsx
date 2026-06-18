import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/lib/auth-context";
import Navbar from "@/app/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Протокол ФЕНИКС — NEXUS Hackathon 2026",
  description: "Международный хакатон по кибербезопасности. 2031 год. Уничтожьте вирус VOID.",
  keywords: ["хакатон", "NEXUS", "ФЕНИКС", "кибербезопасность", "школьники", "программирование"],
  openGraph: {
    title: "Протокол ФЕНИКС — NEXUS Hackathon 2026",
    description: "Международный хакатон по кибербезопасности для школьников. Уничтожьте вирус VOID.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen" style={{ background: '#050816' }}>
        <AuthProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

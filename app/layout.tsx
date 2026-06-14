import type { ReactNode } from "react";
import "./global.css";

export const metadata = {
  title: "Web Game",
  description: "Cyberpunk puzzle game",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050816] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
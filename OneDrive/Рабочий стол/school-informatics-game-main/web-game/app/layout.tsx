import "./global.css";
import type { ReactNode } from "react";

import Background from "@/components/layout/Background";
import TopHUD from "@/components/layout/TopHUD";

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
      <body className="relative min-h-screen overflow-hidden">

        <Background />

        <TopHUD
          progress={20}
          letters={["Ф"]}
          title="PROTOCOL PHOENIX"
        />

        <div className="relative z-20 min-h-screen p-10">
          <div className="w-full max-w-[1700px] mx-auto">
            {children}
          </div>
        </div>

      </body>
    </html>
  );
}
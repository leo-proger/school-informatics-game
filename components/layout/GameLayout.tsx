"use client";

import { ReactNode } from "react";
import Background from "./Background";
import TopHUD from "./TopHUD";

interface Props {
  children: ReactNode;
  progress?: number;
  letters?: string[];
  title?: string;
}

export default function GameLayout({
  children,
  progress = 0,
  letters = [],
  title = "PROTOCOL PHOENIX",
}: Props) {
  return (
    <div className="relative min-h-screen">
      <Background />
      <TopHUD progress={progress} letters={letters} title={title} />

      <div className="relative z-20 min-h-screen flex items-center justify-center p-10">
        <div className="w-full max-w-[1700px]">
          {children}
        </div>
      </div>
    </div>
  );
}
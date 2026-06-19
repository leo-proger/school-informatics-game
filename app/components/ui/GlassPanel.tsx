"use client";

import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export default function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <div
      className={`
        rounded-[28px] border border-cyan-400/45 bg-white/11 backdrop-blur-xl
        shadow-[0_0_50px_rgba(34,211,238,.25)] overflow-hidden relative
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-500/10 before:to-purple-500/10 before:pointer-events-none
        ${className}
      `}
    >
      {children}
    </div>
  );
}
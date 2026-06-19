// app/components/layout/TaskBackground.tsx
"use client";

import Image from "next/image";

interface TaskBackgroundProps {
  children: React.ReactNode;
}

export default function TaskBackground({ children }: TaskBackgroundProps) {
  return (
    <div className="relative min-h-screen">
      {/* Основной фон */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0d1635]" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,.15) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(34,211,238,.30), transparent 30%),
              radial-gradient(circle at 80% 10%, rgba(168,85,247,.25), transparent 25%),
              radial-gradient(circle at 70% 80%, rgba(6,182,212,.25), transparent 35%)
            `,
          }}
        />
        
        {/* Логотип Phoenix — левый край */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none w-[300px] h-[400px]">
          <Image
            src="/images/phoenix-logo.png"
            alt="Phoenix"
            width={300}
            height={400}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Логотип Phoenix — правый край (тот же src — берётся из кеша) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none w-[300px] h-[400px] scale-x-[-1]">
          <Image
            src="/images/phoenix-logo.png"
            alt="Phoenix"
            width={300}
            height={400}
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
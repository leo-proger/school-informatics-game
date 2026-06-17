"use client";

interface BackgroundProps {
  variant?: "default" | "void";
}

export default function Background({ variant = "default" }: BackgroundProps) {
  if (variant === "void") {
    return (
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -50 }}>
        <div className="absolute inset-0 bg-[#0a0a0f]" />

        {/* Красная сетка */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239,68,68,.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239,68,68,.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Красные градиенты */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(239,68,68,.25), transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(168,85,247,.20), transparent 35%),
              radial-gradient(circle at 50% 50%, rgba(239,68,68,.10), transparent 50%)
            `,
          }}
        />

        {/* Пульсирующие пятна */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-500" />

        <div className="absolute inset-0 scanlines" />
        <div className="absolute inset-0 noise" />
      </div>
    );
  }

  // Default (NEXUS — синяя тема)
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -50 }}>
      <div className="absolute inset-0 bg-[#050816]" />

      {/* Сетка */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Градиенты */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(34,211,238,.15), transparent 30%),
            radial-gradient(circle at 80% 10%, rgba(168,85,247,.12), transparent 25%),
            radial-gradient(circle at 70% 80%, rgba(6,182,212,.12), transparent 35%)
          `,
        }}
      />

      <div className="absolute inset-0 scanlines" />
      <div className="absolute inset-0 noise" />
    </div>
  );
}
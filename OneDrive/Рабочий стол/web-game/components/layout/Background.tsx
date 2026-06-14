"use client";

export default function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -50 }}>
      <div className="absolute inset-0 bg-[#050816]" />

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
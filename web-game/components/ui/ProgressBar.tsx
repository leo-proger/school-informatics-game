"use client";

interface Props {
  value: number;
  max?: number;
}

export default function ProgressBar({
  value,
  max = 100,
}: Props) {
  const percent = (value / max) * 100;

  return (
    <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
      <div
        className="
          h-full
          bg-cyan-400
          transition-all
          duration-500
          shadow-[0_0_20px_rgba(34,211,238,.7)]
        "
        style={{
          width: `${percent}%`,
        }}
      />
    </div>
  );
}
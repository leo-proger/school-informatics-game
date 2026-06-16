"use client";

interface Props {
  title: string;
  description: string;
  active: boolean;
  completed: boolean;
  locked: boolean;
  failed?: boolean;
  onClick: () => void;
}

export default function TaskCard({
  title,
  description,
  active,
  completed,
  locked,
  failed = false,
  onClick,
}: Props) {
  const isClickable = !locked;

  return (
    <button
      disabled={!isClickable}
      onClick={onClick}
      className={`
        relative w-[290px] h-[180px] rounded-[28px] overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:scale-105 group
        ${active ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_35px_rgba(34,211,238,.35)] scale-110 z-10" : ""}
        ${completed ? "border-green-400 bg-green-500/10 shadow-[0_0_30px_rgba(74,222,128,.3)]" : ""}
        ${failed ? "border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(255,0,0,.3)]" : ""}
        ${locked && !failed ? "border-white/10 bg-black/40 opacity-50 cursor-not-allowed" : ""}
        ${!active && !completed && !failed && !locked ? "opacity-70" : ""}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-cyan-400/5" />

      {!locked && (
        <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent animate-scan" />
      )}

      <div className="relative h-full flex flex-col justify-between p-7">
        <div className="flex justify-between items-start">
          <div>
            <div className={`text-xs tracking-[4px] ${
              failed ? "text-red-400/60" : completed ? "text-green-400/60" : "text-cyan-300/60"
            }`}>
              {failed ? "FAILED" : completed ? "COMPLETED" : "MODULE"}
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">{title}</h2>
          </div>

          <div
            className="w-5 h-5 rounded-full"
            style={{
              background: failed ? "#ef4444" : completed ? "#4ade80" : active ? "#22d3ee" : "#555",
              boxShadow: failed
                ? "0 0 15px #ef4444"
                : completed
                ? "0 0 15px #4ade80"
                : active
                ? "0 0 15px #22d3ee"
                : "none",
            }}
          />
        </div>

        <p className="text-white/70 text-sm leading-relaxed">{description}</p>
      </div>
    </button>
  );
}
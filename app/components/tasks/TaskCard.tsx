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
        relative w-full rounded-[22px] overflow-hidden backdrop-blur-xl border transition-all duration-300 hover:scale-[1.03] group text-left
        ${active ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_35px_rgba(34,211,238,.35)]" : ""}
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

      <div className="relative flex flex-col gap-2 p-5">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <div className={`text-[10px] tracking-[3px] uppercase ${
              failed ? "text-red-400/60" : completed ? "text-green-400/60" : "text-cyan-300/60"
            }`}>
              {failed ? "FAILED" : completed ? "COMPLETED" : "MODULE"}
            </div>
            <h2 className="text-lg font-bold text-white mt-1 leading-tight line-clamp-2">{title}</h2>
          </div>

          <div
            className="w-4 h-4 rounded-full shrink-0 mt-1"
            style={{
              background: failed ? "#ef4444" : completed ? "#4ade80" : active ? "#22d3ee" : "#555",
              boxShadow: failed
                ? "0 0 12px #ef4444"
                : completed
                ? "0 0 12px #4ade80"
                : active
                ? "0 0 12px #22d3ee"
                : "none",
            }}
          />
        </div>

        <p className="text-white/60 text-xs leading-relaxed line-clamp-4 whitespace-pre-wrap">{description}</p>
      </div>
    </button>
  );
}
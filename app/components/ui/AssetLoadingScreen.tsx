"use client";

interface Props {
  progress: number; // 0..1
  error?: string | null;
  onRetry?: () => void;
  title?: string;
  subtitle?: string;
}

export default function AssetLoadingScreen({
  progress,
  error,
  onRetry,
  title = "ЗАГРУЗКА ПРОТОКОЛА",
  subtitle = "Подготавливаем видео и данные миссии…",
}: Props) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#050816] flex items-center justify-center overflow-hidden">
      {/* Фоновая сетка */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Свечение */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-8 text-center">
        {/* Эмблема */}
        <div className="mx-auto mb-8 w-20 h-20 rounded-2xl border border-cyan-500/40 flex items-center justify-center
          shadow-[0_0_40px_rgba(34,211,238,0.25)] animate-pulse-glow">
          <span className="text-3xl font-black text-cyan-300">Ф</span>
        </div>

        <p className="text-[10px] font-mono tracking-[0.5em] text-cyan-400/70 uppercase mb-2">/PROTOCOL PHOENIX/</p>
        <h1 className="text-xl font-black text-white tracking-wide mb-2">{title}</h1>
        <p className="text-xs font-mono text-slate-400 mb-8 leading-relaxed">
          {error ? "Сбой загрузки — повторяем попытку…" : subtitle}
        </p>

        {/* Прогресс-бар */}
        <div className="relative h-3 rounded-full bg-white/5 border border-cyan-500/20 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-[width] duration-300 ease-out
              shadow-[0_0_18px_rgba(34,211,238,0.6)]"
            style={{ width: `${pct}%` }}
          />
          {/* Бегущий блик */}
          {!error && (
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-scan" />
          )}
        </div>

        <div className="flex items-center justify-between mt-3 font-mono text-xs">
          <span className="text-slate-500">{error ? "RETRY" : "LOADING"}</span>
          <span className="text-cyan-300 font-bold tabular-nums">{pct}%</span>
        </div>

        {error && onRetry && (
          <button
            onClick={onRetry}
            className="mt-8 px-5 py-2 rounded border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-mono hover:bg-cyan-500/20 transition-colors"
          >
            Повторить загрузку
          </button>
        )}
      </div>
    </div>
  );
}

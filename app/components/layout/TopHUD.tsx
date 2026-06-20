"use client";

interface Props {
  progress?: number;
  title?: string;
  letters?: string[];
}

export default function TopHUD({
  progress = 20,
  title = "PROTOCOL PHOENIX",
  letters = [],
}: Props) {
  return (
    <div className="fixed top-0 left-0 w-full z-40 p-4 sm:p-8">
      <div className="flex justify-between items-center gap-3">
        <div className="flex gap-2 sm:gap-3 shrink-0">
          <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-yellow-300 animate-pulse" />
          <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-yellow-300" />
        </div>

        <div className="text-yellow-300 font-bold tracking-[3px] sm:tracking-[6px] text-xs sm:text-base text-center truncate">
          {title}
        </div>

        <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-yellow-300 shrink-0" />
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="flex justify-between text-[10px] sm:text-xs text-yellow-300 mb-2">
          <span>NETWORK</span>
          <span>{progress}%</span>
        </div>
        <div className="h-[6px] rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-yellow-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 sm:mt-5 flex gap-2 sm:gap-3 justify-center flex-wrap">
        {letters.map((letter, idx) => (
          <div
            key={`${letter}-${idx}`}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-300 font-bold text-base sm:text-xl"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}
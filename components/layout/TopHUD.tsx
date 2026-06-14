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
    <div className="fixed top-0 left-0 w-full z-40 p-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <div className="w-5 h-5 rounded-full bg-yellow-300 animate-pulse" />
          <div className="w-5 h-5 rounded-full bg-yellow-300" />
        </div>

        <div className="text-yellow-300 font-bold tracking-[6px]">
          {title}
        </div>

        <div className="w-5 h-5 rounded-full bg-yellow-300" />
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs text-yellow-300 mb-2">
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

      <div className="mt-5 flex gap-3 justify-center flex-wrap">
        {letters.map((letter, idx) => (
          <div
            key={`${letter}-${idx}`}
            className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-300 font-bold text-xl"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
}
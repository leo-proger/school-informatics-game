"use client";

import { useEffect, useState } from "react";
import GlassPanel from "../ui/GlassPanel";
import NeonButton from "../ui/NeonButton";

interface PuzzleModalProps {
  open: boolean;
  title?: string;
  description?: string;
  hint?: string;
  onClose: () => void;
  onSubmit: (value: string) => boolean;
  timeLimit?: number; // seconds
}
export default function PuzzleModal({
  open,
  title = "SYSTEM PUZZLE",
  description,
  hint,
  onClose,
  onSubmit,
  timeLimit,
}: PuzzleModalProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [timeLeft, setTimeLeft] = useState(timeLimit ?? 0);

  // ⏱ таймер
  useEffect(() => {
    if (!timeLimit || !open) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, timeLimit]);

  // ESC закрытие
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") handleSubmit();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [input]);

  const handleSubmit = () => {
    const result = onSubmit(input);
  }

  if (!open) return null;
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="relative w-[700px] animate-pulse-glow">
        {/* scanline */}
        <div className="scanline" />

        <GlassPanel className="p-6 border border-cyan-400/30 shadow-[0_0_40px_#00ffff33]">
          
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-cyan-300 font-mono tracking-widest">
              ⚡ {title}
            </h2>

            {timeLimit && (
              <div className="text-red-400 font-mono">
                {timeLeft}s
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          {description && (
            <p className="text-gray-300 font-mono mb-4 opacity-80">
              {description}
            </p>
          )}

          {/* TERMINAL INPUT */}
          <div className="bg-black/60 border border-cyan-500/20 p-4 font-mono text-cyan-200 mb-4">
            <div className="opacity-60 mb-2">INPUT:</div>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent outline-none text-cyan-300"
              placeholder="type your answer..."
            />
          </div>

          {/* STATUS */}
          {status === "success" && (
            <div className="text-green-400 font-mono mb-2">
              ✓ ACCESS GRANTED
            </div>
          )}

          {status === "error" && (
            <div className="text-red-400 font-mono mb-2">
              ✕ ACCESS DENIED
            </div>
          )}

          {/* HINT */}
          {hint && (
            <div className="text-yellow-300 text-sm font-mono mb-4 opacity-70">
              💡 {hint}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
<NeonButton color="cyan" onClick={onClose}>
  Close
</NeonButton>

<NeonButton color="purple" onClick={handleSubmit}>
  Execute
</NeonButton>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

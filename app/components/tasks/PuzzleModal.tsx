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
  timeLimit?: number;
  isCompleted?: boolean;
  isFailed?: boolean;
  isLocked?: boolean; // для заблокированных задач (недоступных)
}

export default function PuzzleModal({
  open,
  title = "SYSTEM PUZZLE",
  description,
  hint,
  onClose,
  onSubmit,
  timeLimit,
  isCompleted = false,
  isFailed = false,
  isLocked = false,
}: PuzzleModalProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [timeLeft, setTimeLeft] = useState(timeLimit ?? 0);
  const [showHint, setShowHint] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Если задача завершена или провалена — поле ввода заблокировано
  const isReadOnly = isCompleted || isFailed || isLocked;

  useEffect(() => {
    if (!timeLimit || !open || isReadOnly) return;
    
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
  }, [open, timeLimit, isReadOnly]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && !isReadOnly && !hasAttempted) {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [input, isReadOnly, hasAttempted]);

const handleSubmit = () => {
  if (isReadOnly || hasAttempted) return;
  
  const result = onSubmit(input);
  setStatus(result ? "success" : "error");
  setHasAttempted(true);
  
  // ВСЕГДА закрываем через 1.5 секунды, даже при правильном ответе
  setTimeout(() => {
    onClose();
    setStatus("idle");
    setInput("");
    setHasAttempted(false);
  }, 1500);
};

  if (!open) return null;

  // Статусные сообщения
  const getStatusMessage = () => {
    if (isCompleted) return { text: "✓ ЗАДАНИЕ ВЫПОЛНЕНО", className: "text-green-400" };
    if (isFailed) return { text: "✕ ЗАДАНИЕ ПРОВАЛЕНО", className: "text-red-500" };
    if (isLocked) return { text: "🔒 ЗАДАНИЕ ЗАБЛОКИРОВАНО", className: "text-gray-500" };
    if (status === "success") return { text: "✓ ACCESS GRANTED", className: "text-green-400" };
    if (status === "error") return { text: "✕ ACCESS DENIED", className: "text-red-500" };
    return null;
  };

  const statusMessage = getStatusMessage();

  // Определяем цвет рамки
  const getBorderColor = () => {
    if (isCompleted) return 'border-green-400/30 shadow-[0_0_40px_#00ff0033]';
    if (isFailed) return 'border-red-500/50 shadow-[0_0_60px_#ff000055]';
    if (isLocked) return 'border-gray-500/20 shadow-none';
    return 'border-cyan-400/30 shadow-[0_0_40px_#00ffff33]';
  };

  // Определяем цвет заголовка
  const getTitleColor = () => {
    if (isCompleted) return 'text-green-400';
    if (isFailed) return 'text-red-500';
    if (isLocked) return 'text-gray-500';
    return 'text-cyan-300';
  };

  // Определяем иконку заголовка
  const getTitleIcon = () => {
    if (isCompleted) return '✅';
    if (isFailed) return '❌';
    if (isLocked) return '🔒';
    return '⚡';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="relative w-[700px] animate-pulse-glow">
        <div className="scanline" />

        <GlassPanel className={`p-6 border ${getBorderColor()}`}>
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className={`font-mono tracking-widest ${getTitleColor()}`}>
              {getTitleIcon()} {title}
            </h2>

            {timeLimit && !isReadOnly && (
              <div className={`font-mono ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-red-400'}`}>
                {timeLeft}s
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          {description && (
            <p className="text-gray-300 font-mono mb-4 opacity-80 whitespace-pre-line">
              {description}
            </p>
          )}

          {/* STATUS MESSAGE */}
          {statusMessage && (
            <div className={`${statusMessage.className} font-mono mb-4 text-center py-2 px-4 rounded-lg ${
              isCompleted ? 'bg-green-500/10 border border-green-500/20' : 
              isFailed ? 'bg-red-500/10 border border-red-500/20' :
              isLocked ? 'bg-gray-500/10 border border-gray-500/20' : ''
            }`}>
              {statusMessage.text}
            </div>
          )}

          {/* TERMINAL INPUT */}
          <div className={`bg-black/60 border p-4 font-mono text-cyan-200 mb-4 ${
            isCompleted ? 'border-green-500/20' : 
            isFailed ? 'border-red-500/30' : 
            isLocked ? 'border-gray-500/20' :
            'border-cyan-500/20'
          }`}>
            <div className={`opacity-60 mb-2 ${
              isCompleted ? 'text-green-400' : 
              isFailed ? 'text-red-400' : 
              isLocked ? 'text-gray-500' :
              ''
            }`}>
              {isCompleted ? '✓ ВЫПОЛНЕНО' : 
               isFailed ? '✕ ПРОВАЛЕНО' : 
               isLocked ? '🔒 ЗАБЛОКИРОВАНО' : 
               'INPUT:'}
            </div>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full bg-transparent outline-none ${
                isCompleted ? 'text-green-400 cursor-not-allowed' : 
                isFailed ? 'text-red-400 cursor-not-allowed' : 
                isLocked ? 'text-gray-500 cursor-not-allowed' : 
                'text-cyan-300'
              }`}
              placeholder={isCompleted ? 'Задание выполнено ✓' : 
                          isFailed ? 'Доступ запрещён ✕' : 
                          isLocked ? 'Задание недоступно 🔒' : 
                          'type your answer...'}
              disabled={isReadOnly || hasAttempted}
              autoFocus={!isReadOnly}
            />
          </div>

          {/* HINT BUTTON & CONTENT */}
          {hint && !isFailed && !isLocked && (
            <div className="mb-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className={`
                  group relative px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300
                  ${showHint 
                    ? 'bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.2)]' 
                    : 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                  }
                  ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={isCompleted}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">{showHint ? '🔒' : '💡'}</span>
                  <span>{showHint ? 'Скрыть подсказку' : 'Показать подсказку'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${showHint ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`
                  mt-3 overflow-hidden transition-all duration-300 ease-in-out
                  ${showHint ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="p-4 bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-sm font-mono leading-relaxed">
                    <span className="text-yellow-500/70 mr-2">💡</span>
                    {hint}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <NeonButton 
              color={isFailed ? "red" : isCompleted ? "cyan" : "cyan"} 
              onClick={onClose}
            >
              {isCompleted ? "Закрыть" : isFailed ? "Закрыть" : "Закрыть"}
            </NeonButton>

            {!isReadOnly && !hasAttempted && (
              <NeonButton color="purple" onClick={handleSubmit}>
                Execute
              </NeonButton>
            )}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
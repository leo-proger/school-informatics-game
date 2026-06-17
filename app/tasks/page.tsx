"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Background from "@/app/components/layout/Background";
import GlassPanel from "@/app/components/ui/GlassPanel";
import NeonButton from "@/app/components/ui/NeonButton";
import { useAuth } from "@/app/lib/auth-context";
import { SAVE_KEY as ROUND1_SAVE_KEY } from "./round1/page";
import { SAVE_KEY as ROUND2_SAVE_KEY } from "./round2/page";

function getSaveLabel(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    const phase: string = data.phase ?? "";
    const completed: string[] = data.completedTasks ?? [];
    if (phase === "victory") return "Финал пройден";
    if (phase === "round2Boss" || phase === "round2Dialogue") return "Тур 2 — финальный босс";
    if (phase === "round2Code") return "Тур 2 — ввод кода";
    if (phase === "round1Complete" || phase === "round1Code") return "Тур 1 завершён ✅";
    if (phase === "round1" || phase === "taskDialogue")
      return `Тур 1 — задание ${completed.length + 1}`;
    if (phase === "prologue" || phase === "video") return "Вступление";
    return null;
  } catch {
    return null;
  }
}

// Проверяем, пройден ли 1 тур
function isRound1Complete(): boolean {
  if (localStorage.getItem("round1Completed") === "true") return true;
  
  try {
    const raw = localStorage.getItem(ROUND1_SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    const completed: string[] = data.completedTasks ?? [];
    if (completed.length >= 6) return true;
    if (data.phase === "round1Complete" || data.phase === "round1Code") return true;
    if (data.phase === "round2Code" || data.phase === "round2Dialogue" || 
        data.phase === "round2Boss" || data.phase === "victory") return true;
    return false;
  } catch {
    return false;
  }
}

// Проверяем, есть ли сохранение для 2 тура
function hasRound2Save(): boolean {
  try {
    const raw = localStorage.getItem(ROUND2_SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return data.phase === "boss" || data.phase === "victory" || data.phase === "dialogue";
  } catch {
    return false;
  }
}

export default function TasksPage() {
  const router = useRouter();
  const { team, isLoading } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRound2Reset, setShowRound2Reset] = useState(false);
  const [saveLabel, setSaveLabel] = useState<string | null>(null);
  const [round2Unlocked, setRound2Unlocked] = useState(false);
  const [round1Completed, setRound1Completed] = useState(false);
  const [round2HasSave, setRound2HasSave] = useState(false);

  useEffect(() => {
    if (!isLoading && !team) {
      router.replace("/login");
    }
  }, [team, isLoading, router]);

  useEffect(() => {
    const raw = localStorage.getItem(ROUND1_SAVE_KEY);
    setSaveLabel(getSaveLabel(raw));
    
    const isDone = isRound1Complete();
    setRound1Completed(isDone);
    setRound2Unlocked(isDone);
    setRound2HasSave(hasRound2Save());
  }, []);

  if (isLoading || !team) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#050816' }}>
        <div className="w-8 h-8 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  const handleContinue = () => {
    router.push("/tasks/round1");
  };

  const handleFresh = () => {
    localStorage.removeItem(ROUND1_SAVE_KEY);
    localStorage.removeItem("round1Completed");
    localStorage.removeItem("collectedLetters");
    router.push("/tasks/round1");
  };

  const handleResetRound2 = () => {
    localStorage.removeItem(ROUND2_SAVE_KEY);
    setRound2HasSave(false);
    setShowRound2Reset(false);
    router.push("/tasks/round2");
  };

  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] text-cyan-400 uppercase font-mono mb-3">/ВЫБОР ТУРА/</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
            ПРОТОКОЛ{" "}
            <span className="text-cyan-300" style={{ textShadow: "0 0 20px rgba(34,211,238,0.6)" }}>
              ФЕНИКС
            </span>
          </h1>
          <p className="text-slate-400 font-mono text-sm mt-3">Выберите тур для прохождения</p>
        </div>

        {/* Tour cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full">
          {/* Тур 1 */}
          <div onClick={() => setShowConfirm(true)} className="group cursor-pointer">
            <GlassPanel className="p-8 flex flex-col items-center text-center hover:border-cyan-400/60 transition-all duration-300 h-full">
              <div className="w-16 h-16 rounded-full border-2 border-cyan-400/50 flex items-center justify-center mb-5
                group-hover:border-cyan-300 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.4)] transition-all duration-300">
                <span className="text-2xl font-black text-cyan-300">1</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide mb-2">ТУР 1</h2>
              <p className="text-xs text-cyan-400 tracking-widest uppercase font-mono mb-4">NEXUS PROTOCOL</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Расшифруйте данные, найдите уязвимости вируса VOID и соберите ключ доступа.
              </p>
              {round1Completed ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                    ТУР 1 ЗАВЕРШЁН
                  </div>
                </div>
              ) : saveLabel ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-yellow-400">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
                    СОХРАНЕНИЕ НАЙДЕНО
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{saveLabel}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                  ДОСТУПНО
                </div>
              )}
            </GlassPanel>
          </div>

          {/* Тур 2 */}
          {round2Unlocked ? (
            <div className="relative group">
              <div 
                onClick={() => {
                  if (round2HasSave) {
                    setShowRound2Reset(true);
                  } else {
                    router.push("/tasks/round2");
                  }
                }} 
                className="cursor-pointer"
              >
                <GlassPanel className="p-8 flex flex-col items-center text-center hover:border-red-400/60 transition-all duration-300 h-full border-red-500/20">
                  <div className="w-16 h-16 rounded-full border-2 border-red-400/50 flex items-center justify-center mb-5
                    group-hover:border-red-300 group-hover:shadow-[0_0_24px_rgba(239,68,68,0.4)] transition-all duration-300">
                    <span className="text-2xl font-black text-red-400">2</span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-wide mb-2">ТУР 2</h2>
                  <p className="text-xs text-red-400 tracking-widest uppercase font-mono mb-4">VOID PROTOCOL</p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Финальное столкновение с VOID. Введите код доступа и уничтожьте вирус!
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                    ДОСТУПЕН
                  </div>
                  {round2HasSave && (
                    <div className="mt-2 text-xs font-mono text-yellow-400/70">
                      ⚡ Есть сохранение
                    </div>
                  )}
                </GlassPanel>
              </div>
            </div>
          ) : (
            <GlassPanel className="p-8 flex flex-col items-center text-center opacity-50 cursor-not-allowed border-gray-700/40">
              <div className="w-16 h-16 rounded-full border-2 border-gray-600/40 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.5 10.5V7.5a4.5 4.5 0 00-9 0v3M5.25 10.5h13.5a.75.75 0 01.75.75v8.25a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V11.25a.75.75 0 01.75-.75z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-400 tracking-wide mb-2">ТУР 2</h2>
              <p className="text-xs text-gray-500 tracking-widest uppercase font-mono mb-4">VOID PROTOCOL</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Финальное столкновение с VOID. Требуется завершить Тур 1.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                ЗАБЛОКИРОВАНО
              </div>
              <p className="text-gray-700 text-xs mt-2 font-mono">
                Требуется завершить 6 заданий в Туре 1
              </p>
            </GlassPanel>
          )}
        </div>

        {/* Статус прогресса */}
        {round1Completed && (
          <div className="mt-8 text-center">
            <div className="flex items-center gap-3 text-green-400 text-sm font-mono">
              <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)] animate-pulse" />
              ТУР 1 ЗАВЕРШЁН — ТУР 2 РАЗБЛОКИРОВАН
            </div>
          </div>
        )}
      </div>

      {/* Confirmation modal для Тура 1 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <GlassPanel className="p-10 max-w-md w-full text-center">
            {round1Completed ? (
              <>
                <div className="w-14 h-14 rounded-full border border-green-400/40 bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Тур 1 уже пройден!</h3>
                <p className="text-slate-400 text-sm font-mono mb-8 leading-relaxed">
                  Хотите <span className="text-cyan-300">пройти заново</span> или перейти к <span className="text-red-400">Туру 2</span>?
                </p>
                <div className="flex flex-col gap-3">
                  <NeonButton color="cyan" onClick={handleFresh} className="w-full justify-center">
                    ПРОЙТИ ЗАНОВО
                  </NeonButton>
                  <NeonButton 
                    color="red" 
                    onClick={() => {
                      if (round2HasSave) {
                        setShowConfirm(false);
                        setShowRound2Reset(true);
                      } else {
                        router.push("/tasks/round2");
                      }
                    }} 
                    className="w-full justify-center"
                  >
                    ПЕРЕЙТИ К ТУРУ 2
                  </NeonButton>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-1"
                  >
                    Отмена
                  </button>
                </div>
              </>
            ) : saveLabel ? (
              <>
                <div className="w-14 h-14 rounded-full border border-yellow-400/40 bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Найдено сохранение</h3>
                <p className="text-slate-400 text-sm font-mono mb-2 leading-relaxed">
                  <span className="text-yellow-300">{saveLabel}</span>
                </p>
                <p className="text-slate-500 text-xs font-mono mb-8">Продолжить с места остановки или начать заново?</p>
                <div className="flex flex-col gap-3">
                  <NeonButton color="cyan" onClick={handleContinue} className="w-full justify-center">
                    ПРОДОЛЖИТЬ
                  </NeonButton>
                  <NeonButton color="red" onClick={handleFresh} className="w-full justify-center">
                    НАЧАТЬ ЗАНОВО
                  </NeonButton>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-1"
                  >
                    Отмена
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Начать игру?</h3>
                <p className="text-slate-400 text-sm font-mono mb-8 leading-relaxed">
                  Вы начнёте <span className="text-cyan-300">Тур 1 — NEXUS Protocol</span>.<br />
                  Таймер запустится сразу после старта.
                </p>
                <div className="flex gap-4 justify-center">
                  <NeonButton color="cyan" onClick={handleFresh}>
                    НАЧАТЬ
                  </NeonButton>
                  <NeonButton color="red" onClick={() => setShowConfirm(false)}>
                    ОТМЕНА
                  </NeonButton>
                </div>
              </>
            )}
          </GlassPanel>
        </div>
      )}

      {/* Modal для сброса 2 тура */}
      {showRound2Reset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <GlassPanel className="p-10 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full border border-yellow-400/40 bg-yellow-500/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Найдено сохранение Тура 2</h3>
            <p className="text-slate-400 text-sm font-mono mb-2 leading-relaxed">
              У вас есть сохранённый прогресс во втором туре.
            </p>
            <p className="text-slate-500 text-xs font-mono mb-8">
              Хотите продолжить с места остановки или начать заново?
            </p>
            <div className="flex flex-col gap-3">
              <NeonButton 
                color="cyan" 
                onClick={() => {
                  setShowRound2Reset(false);
                  router.push("/tasks/round2");
                }} 
                className="w-full justify-center"
              >
                ПРОДОЛЖИТЬ
              </NeonButton>
              <NeonButton 
                color="red" 
                onClick={handleResetRound2} 
                className="w-full justify-center"
              >
                НАЧАТЬ ЗАНОВО
              </NeonButton>
              <button
                onClick={() => setShowRound2Reset(false)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors mt-1"
              >
                Отмена
              </button>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
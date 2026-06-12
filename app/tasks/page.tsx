'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/lib/auth-context';
import { TASKS, TOURNAMENT_DATES } from '@/app/lib/mock-data';

function useNow() {
  return new Date();
}

function formatTime(ms: number) {
  if (ms <= 0) return '00:00:00';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TasksPage() {
  const { team } = useAuth();
  const [activeTour, setActiveTour] = useState<1 | 2>(1);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  const now = useNow();

  const tour1Active = now >= TOURNAMENT_DATES.tour1Start && now <= TOURNAMENT_DATES.tour1End;
  const tour2Active = now >= TOURNAMENT_DATES.tour2Start && now <= TOURNAMENT_DATES.tour2End;
  const tour1Ended = now > TOURNAMENT_DATES.tour1End;
  const tour2Ended = now > TOURNAMENT_DATES.tour2End;

  // For demo purposes, simulate tour 1 as active (since we're before actual start date)
  // In production this would use real time
  const isDemoMode = now < TOURNAMENT_DATES.tour1Start;

  const teamSize = team?.participants.length ?? 1;

  const tour1Tasks = TASKS.filter(t => t.tour === 1 && (t.type === 'base' || (t.type === 'extra' && teamSize > 1)));
  const tour2Tasks = TASKS.filter(t => t.tour === 2 && (!t.minTeamSize || t.minTeamSize <= teamSize))
    .sort((a, b) => (a.minTeamSize ?? 0) - (b.minTeamSize ?? 0))
    .slice(-1);

  const currentTasks = activeTour === 1 ? tour1Tasks : tour2Tasks;
  const isActive = activeTour === 1 ? (tour1Active || isDemoMode) : (tour2Active);
  const hasEnded = activeTour === 1 ? tour1Ended : tour2Ended;

  const toggleTask = (id: number) => {
    setExpandedTask(prev => prev === id ? null : id);
  };

  const markComplete = (id: number) => {
    setCompletedTasks(prev => new Set([...prev, id]));
  };

  const tour1StartsIn = TOURNAMENT_DATES.tour1Start.getTime() - now.getTime();
  const tour2StartsIn = TOURNAMENT_DATES.tour2Start.getTime() - now.getTime();

  return (
    <div className="min-h-screen cyber-grid px-4 py-10 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono tracking-[0.4em] text-blue-300 uppercase mb-2">/NEXUS СИСТЕМА/</p>
          <h1 className="text-4xl font-black neon-text mb-3">ЗАДАНИЯ</h1>
          {team ? (
            <p className="text-sm text-slate-200 font-mono">
              Команда: <span className="text-purple-300">{team.name}</span> ·
              {' '}{teamSize} участник(а) ·
              <span className="text-green-400 ml-2">Очки: {team.score}</span>
            </p>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-sm text-yellow-400 w-fit font-mono">
              ⚠ <Link href="/login" className="hover:underline">Войдите в систему</Link> для доступа к заданиям
            </div>
          )}
        </div>

        {/* Tour selector */}
        <div className="flex gap-3 mb-8">
          {([1, 2] as const).map(tour => {
            const active = tour === 1 ? (tour1Active || isDemoMode) : tour2Active;
            const ended = tour === 1 ? tour1Ended : tour2Ended;
            return (
              <button
                key={tour}
                onClick={() => setActiveTour(tour)}
                className={`flex-1 py-4 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-200 border
                  ${activeTour === tour
                    ? 'border-purple-500/50 text-purple-200 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                    : 'border-gray-700/50 text-slate-300 hover:border-purple-500/30 hover:text-slate-100'
                  }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>Тур {tour}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full
                    ${active ? 'bg-green-500/20 text-green-400' : ended ? 'bg-gray-600/20 text-slate-300' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {active ? '● АКТИВЕН' : ended ? '✓ ЗАВЕРШЁН' : '○ ОЖИДАНИЕ'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Timer / countdown */}
        {!isActive && !hasEnded && (
          <div className="card-glow rounded-xl p-5 mb-8 text-center">
            <p className="text-xs font-mono text-slate-300 uppercase tracking-widest mb-2">До начала тура {activeTour}</p>
            <p className="text-3xl font-mono font-black text-purple-300 neon-text">
              {formatTime(activeTour === 1 ? tour1StartsIn : tour2StartsIn)}
            </p>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Старт: {(activeTour === 1 ? TOURNAMENT_DATES.tour1Start : TOURNAMENT_DATES.tour2Start)
                .toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}

        {/* Demo mode notice */}
        {isDemoMode && activeTour === 1 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-blue-500/20 bg-blue-500/5 text-xs text-blue-300 font-mono mb-6">
            ◈ ДЕМО-РЕЖИМ · Задания показаны в ознакомительных целях
          </div>
        )}

        {/* Active timer */}
        {(tour1Active || tour2Active) && (
          <div className="card-glow rounded-xl p-4 mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-green-400 uppercase tracking-widest">Тур {activeTour === 1 ? '1' : '2'} активен</p>
              <p className="text-xs text-slate-300 mt-0.5">
                Завершение: {(activeTour === 1 ? TOURNAMENT_DATES.tour1End : TOURNAMENT_DATES.tour2End)
                  .toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono text-slate-300 uppercase">Осталось</p>
              <p className="text-xl font-mono font-black text-green-400">
                {formatTime((activeTour === 1 ? TOURNAMENT_DATES.tour1End : TOURNAMENT_DATES.tour2End).getTime() - now.getTime())}
              </p>
            </div>
          </div>
        )}

        {/* Tasks list */}
        <div className="space-y-3">
          {currentTasks.length === 0 && (
            <div className="card-glow rounded-xl p-8 text-center text-slate-300 font-mono text-sm">
              Задания для тура {activeTour} пока недоступны
            </div>
          )}

          {currentTasks.map((task, idx) => {
            const isCompleted = completedTasks.has(task.id);
            const isLocked = !isActive && !hasEnded && !isDemoMode;
            const isExpanded = expandedTask === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-xl border transition-all duration-300 overflow-hidden
                  ${isCompleted
                    ? 'border-green-500/30 bg-green-500/5'
                    : isLocked
                      ? 'border-gray-700/30 opacity-60'
                      : 'card-glow hover:border-purple-500/40 cursor-pointer'
                  }`}
              >
                <div
                  className="flex items-center gap-4 p-4"
                  onClick={() => !isLocked && toggleTask(task.id)}
                >
                  {/* Number */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 border
                    ${isCompleted
                      ? 'border-green-500/40 bg-green-500/10 text-green-400'
                      : isLocked
                        ? 'border-gray-700 bg-gray-800/30 text-slate-400'
                        : 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                    }`}>
                    {isCompleted ? '✓' : isLocked ? '🔒' : `${String(idx + 1).padStart(2, '0')}`}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm font-semibold ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      {task.type === 'extra' && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded font-mono bg-blue-500/15 text-blue-300 border border-blue-500/20">
                          +ДОП
                        </span>
                      )}
                      {task.type === 'boss' && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded font-mono bg-red-500/15 text-red-400 border border-red-500/20">
                          BOSS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 truncate">{task.description}</p>
                  </div>

                  {/* Points + expand */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-sm font-mono font-bold ${isCompleted ? 'text-green-400' : 'text-purple-300'}`}>
                      +{task.points}
                    </span>
                    {!isLocked && (
                      <span className={`text-slate-400 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && !isLocked && (
                  <div className="px-4 pb-4 pt-0 border-t border-purple-500/10">
                    <div className="pt-4 space-y-4">
                      <div>
                        <p className="text-xs font-mono text-slate-300 uppercase tracking-widest mb-1">Описание</p>
                        <p className="text-sm text-slate-100 leading-relaxed">{task.description}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                        <p className="text-xs font-mono text-yellow-500 uppercase tracking-widest mb-1">// ПОДСКАЗКА</p>
                        <p className="text-sm text-yellow-300/80 font-mono">{task.hint}</p>
                      </div>
                      {!isCompleted && team && (
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Введите ответ..."
                            className="input-neon flex-1 px-3 py-2 rounded-lg text-sm font-mono"
                            onClick={e => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); markComplete(task.id); }}
                            className="btn-solid px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                          >
                            Отправить
                          </button>
                        </div>
                      )}
                      {isCompleted && (
                        <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                          <span className="text-green-400">✓</span> Задание выполнено · +{task.points} очков
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tour 2 intro text */}
        {activeTour === 2 && (
          <div className="mt-8 card-glow rounded-xl p-6 font-mono text-sm text-slate-100 leading-relaxed">
            <p className="text-red-400 font-bold mb-3 flicker">/ VOID /</p>
            <p className="text-slate-200 mb-3">Да как вы посмели…</p>
            <p className="text-purple-300">/ПРОТОКОЛ/ Поздравляю! Введите собранный код доступа для расшифровки вируса VOID.</p>
          </div>
        )}
      </div>
    </div>
  );
}

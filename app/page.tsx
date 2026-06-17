'use client';

import Link from 'next/link';
import { useAuth } from '@/app/lib/auth-context';
import Background from '@/app/components/layout/Background';

export default function HomePage() {
  const { team } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />

      {/* ── HERO ── */}
      <section className="relative">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #0891b2, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

        <div className="relative z-10 flex flex-col items-center pt-20 pb-14 px-4">
          {/* Badge */}
          <div className="mb-3 px-4 py-1.5 rounded-full border border-cyan-500/40 text-xs tracking-widest text-cyan-300 uppercase font-mono"
            style={{ background: 'rgba(34, 211, 238, 0.06)' }}>
            ◈ NEXUS HACKATHON 2026 · 06.06 — 20.06 ◈
          </div>
          <div className="text-center mt-4 mb-6">
            <p className="text-xs tracking-[0.4em] text-cyan-400 uppercase mb-3 font-mono">/ПРОТОКОЛ/</p>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight neon-text">ФЕНИКС</h1>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500" />
              <span className="text-cyan-300/60 text-sm tracking-widest font-mono">PROTOCOL</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ── BANNER PLACEHOLDER ── */}
      <section className="w-full py-8 flex items-center justify-center border-y border-cyan-500/15"
        style={{ background: 'rgba(0, 8, 22, 0.5)', minHeight: '110px' }}>
        <div className="w-full max-w-4xl mx-4 rounded-xl border-2 border-dashed border-cyan-600/30 flex flex-col items-center justify-center py-8 gap-2"
          style={{ background: 'rgba(0, 20, 40, 0.3)' }}>
          <span className="text-cyan-600 text-xs font-mono tracking-widest uppercase">[ BANNER ]</span>
          <span className="text-cyan-700 text-xs font-mono">Место для баннера / промо-изображения</span>
        </div>
      </section>

      {/* ── TECH INFO ── */}
      <section className="relative">
        <div className="relative z-10 flex justify-center px-4 py-12">
          <div className="card-glow rounded-xl p-6 sm:p-8 max-w-2xl w-full scanline relative overflow-hidden">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <p className="text-xs font-mono text-green-400 tracking-widest uppercase">Входящее сообщение · Phoenix Corps</p>
            </div>
            <div className="space-y-3 font-mono text-sm text-slate-100 leading-relaxed">
              <p>
                <span className="text-cyan-300">[2031]</span> Международная цифровая инфраструктура объединена в единую сеть{' '}
                <span className="text-sky-300 font-semibold">NEXUS</span> — она обслуживает энергосистемы, транспорт, медицину и архивы знаний 50+ стран.
              </p>
              <p>
                Внезапно NEXUS атакует самообучающийся вирус{' '}
                <span className="text-red-400 font-semibold flicker">VOID</span>: он не уничтожает данные — он их{' '}
                <span className="text-yellow-400">искажает</span>. Алгоритмы дают неверные результаты. Шифры ломаются. Маршрутизация сходит с ума.
              </p>
              <p>
                Организация <span className="text-cyan-300 font-semibold">Phoenix Corps</span> вербует команды молодых специалистов, которые мыслят нестандартно.
              </p>
              <div className="mt-4 pt-4 border-t border-cyan-500/20 text-cyan-300">
                Добро пожаловать. Вы были выбраны для уничтожения вируса{' '}
                <span className="text-red-400 flicker">VOID</span>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THREE CARDS ── */}
      <section className="relative">
        <div className="relative z-10 max-w-5xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Card 1 — Туры */}
            <div className="card-glow rounded-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-center py-8 px-6"
                style={{ background: 'rgba(8, 145, 178, 0.06)' }}>
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="5" fill="none" stroke="#0891b2" strokeWidth="1.5" />
                  <circle cx="50" cy="15" r="5" fill="none" stroke="#0891b2" strokeWidth="1.5" />
                  <circle cx="80" cy="20" r="5" fill="none" stroke="#0891b2" strokeWidth="1.5" />
                  <circle cx="35" cy="50" r="5" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                  <circle cx="65" cy="50" r="5" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                  <circle cx="50" cy="80" r="7" fill="none" stroke="#67e8f9" strokeWidth="2" />
                  <line x1="20" y1="20" x2="50" y2="15" stroke="#0891b2" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1="50" y1="15" x2="80" y2="20" stroke="#0891b2" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1="20" y1="20" x2="35" y2="50" stroke="#0891b2" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1="50" y1="15" x2="35" y2="50" stroke="#0891b2" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1="50" y1="15" x2="65" y2="50" stroke="#0891b2" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1="80" y1="20" x2="65" y2="50" stroke="#0891b2" strokeWidth="1" strokeDasharray="3 2" />
                  <line x1="35" y1="50" x2="50" y2="80" stroke="#22d3ee" strokeWidth="1.5" />
                  <line x1="65" y1="50" x2="50" y2="80" stroke="#22d3ee" strokeWidth="1.5" />
                  <circle cx="50" cy="80" r="4" fill="#0891b2" opacity="0.6" />
                  <circle cx="50" cy="15" r="3" fill="#22d3ee" opacity="0.5" />
                </svg>
              </div>
              <div className="flex flex-col flex-1 p-5 gap-4">
                <div>
                  <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-2">Туры хакатона</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Два тура испытаний: шифры, логика и двоичный код. Каждый тур — новый уровень сложности на пути к уничтожению VOID.
                  </p>
                  <div className="mt-3 flex flex-col gap-1 font-mono text-xs">
                    <span className="text-cyan-400">▸ Тур 1 · 09.06 · 10:00–10:40</span>
                    <span className="text-sky-400">▸ Тур 2 · 15.06 · 11:00–12:30</span>
                  </div>
                </div>
                {team ? (
                  <Link href="/tasks"
                    className="btn-solid text-center py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase mt-auto">
                    Начать миссию →
                  </Link>
                ) : (
                  <Link href="/register"
                    className="btn-solid text-center py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase mt-auto">
                    Начать миссию →
                  </Link>
                )}
              </div>
            </div>

            {/* Card 2 — Рейтинг */}
            <div className="card-glow rounded-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-center py-8 px-6"
                style={{ background: 'rgba(14, 116, 144, 0.06)' }}>
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="60" width="20" height="28" rx="2" fill="none" stroke="#0891b2" strokeWidth="1.5" />
                  <rect x="38" y="40" width="24" height="48" rx="2" fill="none" stroke="#22d3ee" strokeWidth="2" />
                  <rect x="70" y="52" width="20" height="36" rx="2" fill="none" stroke="#0891b2" strokeWidth="1.5" />
                  <rect x="10" y="60" width="20" height="6" rx="2" fill="#0e7490" opacity="0.4" />
                  <rect x="38" y="40" width="24" height="8" rx="2" fill="#22d3ee" opacity="0.5" />
                  <rect x="70" y="52" width="20" height="6" rx="2" fill="#0e7490" opacity="0.4" />
                  <text x="20" y="57" textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="monospace">2</text>
                  <text x="50" y="37" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="monospace">1</text>
                  <text x="80" y="49" textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="monospace">3</text>
                  <polygon points="50,18 52.5,25 60,25 54,29.5 56.5,37 50,32.5 43.5,37 46,29.5 40,25 47.5,25"
                    fill="none" stroke="#fbbf24" strokeWidth="1.2" />
                  <polygon points="50,21 51.8,26.5 57.5,26.5 52.8,29.8 54.6,35.5 50,32.2 45.4,35.5 47.2,29.8 42.5,26.5 48.2,26.5"
                    fill="#fbbf24" opacity="0.3" />
                </svg>
              </div>
              <div className="flex flex-col flex-1 p-5 gap-4">
                <div>
                  <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-2">Рейтинг команд</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Следи за позицией своей команды в таблице лидеров. Кто быстрее взломает протокол — тот поднимется выше.
                  </p>
                  <div className="mt-3 font-mono text-xs text-slate-400">
                    <span className="text-yellow-400">◈</span> Призы за топ-3 места
                  </div>
                </div>
                <Link href="/leaderboard"
                  className="btn-neon text-center py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase mt-auto">
                  Перейти к рейтингу →
                </Link>
              </div>
            </div>

            {/* Card 3 — Расписание */}
            <div className="card-glow rounded-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-center py-8 px-6"
                style={{ background: 'rgba(6, 182, 212, 0.04)' }}>
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="20" width="76" height="64" rx="4" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                  <rect x="12" y="20" width="76" height="16" rx="4" fill="#22d3ee" opacity="0.1" />
                  <line x1="12" y1="36" x2="88" y2="36" stroke="#22d3ee" strokeWidth="1" />
                  <line x1="30" y1="14" x2="30" y2="26" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
                  <line x1="70" y1="14" x2="70" y2="26" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
                  {[0,1,2,3,4,5,6].map(c => [0,1,2,3].map(r => (
                    <circle key={`${c}-${r}`}
                      cx={22 + c * 10} cy={44 + r * 12} r="2"
                      fill={r === 0 && c === 3 ? '#22d3ee' : r === 1 && c === 5 ? '#06b6d4' : '#1e293b'}
                    />
                  )))}
                  <rect x="50" y="40" width="10" height="10" rx="2" fill="#22d3ee" opacity="0.2" />
                  <circle cx="55" cy="45" r="2.5" fill="#22d3ee" opacity="0.9" />
                  <line x1="20" y1="88" x2="80" y2="88" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 2" />
                  <circle cx="20" cy="88" r="2" fill="#67e8f9" />
                  <circle cx="80" cy="88" r="2" fill="#67e8f9" />
                </svg>
              </div>
              <div className="flex flex-col flex-1 p-5 gap-4">
                <div>
                  <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-2">Расписание туров</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Следи за расписанием и не пропусти ни одного тура. Финал и награждение — 20 июня.
                  </p>
                  <div className="mt-3 flex flex-col gap-1 font-mono text-xs">
                    <span className="text-green-400">▸ 06.06 — Старт турнира</span>
                    <span className="text-yellow-400">▸ 20.06 — Финал и награждение</span>
                  </div>
                </div>
                <Link href="/leaderboard"
                  className="btn-neon text-center py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase mt-auto">
                  Расписание туров →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-cyan-500/15"
        style={{ background: 'rgba(0, 5, 15, 0.7)' }}>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded border border-cyan-500/50 flex items-center justify-center">
                  <span className="text-cyan-300 font-bold text-xs">Ф</span>
                </div>
                <span className="font-bold text-sm tracking-widest text-cyan-300 uppercase">
                  Protocol<span className="text-sky-400 ml-1">Phoenix</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-mono">
                Международный хакатон по информатике и кибербезопасности для школьников.
              </p>
              <p className="text-xs text-slate-600 mt-3 font-mono">© 2026 NEXUS Hackathon</p>
            </div>

            <div>
              <p className="text-xs text-cyan-300 tracking-widest uppercase font-mono mb-4">Расписание</p>
              <ul className="space-y-2 text-xs font-mono">
                {[
                  { date: '06.06', label: 'Старт турнира', color: 'text-green-400' },
                  { date: '09.06', label: 'Тур 1 · 10:00–10:40', color: 'text-cyan-400' },
                  { date: '15.06', label: 'Тур 2 · 11:00–12:30', color: 'text-sky-400' },
                  { date: '20.06', label: 'Финал и награждение', color: 'text-yellow-400' },
                ].map(e => (
                  <li key={e.date} className="flex items-center gap-3">
                    <span className={`${e.color} w-12 shrink-0`}>{e.date}</span>
                    <span className="text-slate-400">{e.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs text-cyan-300 tracking-widest uppercase font-mono mb-4">Форматы</p>
              <ul className="space-y-2 text-xs font-mono text-slate-400">
                {[
                  '1–5 участников в команде',
                  'Шифры, логика, двоичный код',
                  'Командный формат, онлайн',
                  'Призы за топ-3 места',
                  'Все уровни подготовки',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-cyan-500">◈</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-cyan-500/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs font-mono">
              <Link href="/tasks" className="text-slate-500 hover:text-cyan-300 transition-colors">Задания</Link>
              <Link href="/leaderboard" className="text-slate-500 hover:text-cyan-300 transition-colors">Рейтинг</Link>
              <Link href="/register" className="text-slate-500 hover:text-cyan-300 transition-colors">Регистрация</Link>
              <Link href="/login" className="text-slate-500 hover:text-cyan-300 transition-colors">Вход</Link>
            </div>
            <p className="text-xs font-mono text-slate-600">
              NEXUS · 2031 · <span className="text-red-600/70">VOID</span> must fall
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

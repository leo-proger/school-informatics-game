'use client';

import Background from '@/app/components/layout/Background';
import Link from 'next/link';

const schedule = [
  {
    date: '06.06.2026',
    day: 'Суббота',
    color: 'cyan',
    events: [
      { time: '10:00', title: 'Старт турнира', desc: 'Открытие регистрации и вступительный брифинг команд' },
    ],
  },
  {
    date: '09.06.2026',
    day: 'Вторник',
    color: 'cyan',
    events: [
      { time: '10:00', title: 'Тур 1 — NEXUS Protocol', desc: 'Шифры, логика и двоичный код. Продолжительность: 40 минут' },
      { time: '10:40', title: 'Окончание Тура 1', desc: 'Результаты фиксируются, подведение итогов' },
    ],
  },
  {
    date: '15.06.2026',
    day: 'Понедельник',
    color: 'red',
    events: [
      { time: '11:00', title: 'Тур 2 — VOID Protocol', desc: 'Финальное столкновение с VOID. Продолжительность: 90 минут' },
      { time: '12:30', title: 'Окончание Тура 2', desc: 'Сбор всех результатов, проверка ответов' },
    ],
  },
  {
    date: '20.06.2026',
    day: 'Суббота',
    color: 'yellow',
    events: [
      { time: '12:00', title: 'Финал и награждение', desc: 'Объявление победителей, вручение призов топ-3 командам' },
    ],
  },
];

const colorMap = {
  cyan: {
    dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    date: 'text-cyan-300',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    line: 'bg-cyan-500/30',
  },
  red: {
    dot: 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]',
    date: 'text-red-400',
    border: 'border-red-500/30',
    badge: 'bg-red-500/10 text-red-300 border-red-500/30',
    line: 'bg-red-500/30',
  },
  yellow: {
    dot: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]',
    date: 'text-yellow-300',
    border: 'border-yellow-500/30',
    badge: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    line: 'bg-yellow-500/30',
  },
};

export default function SchedulePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-mono tracking-[0.4em] text-cyan-400 uppercase mb-3">/NEXUS ОЛИМПИАДА 2026/</p>
          <h1 className="text-4xl font-black neon-text mb-2">РАСПИСАНИЕ</h1>
          <p className="text-sm text-slate-400 font-mono">06 июня — 20 июня 2026 года</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-cyan-500/15" />

          <div className="space-y-10">
            {schedule.map((day, di) => {
              const c = colorMap[day.color as keyof typeof colorMap];
              return (
                <div key={di} className="relative pl-16">
                  {/* Dot */}
                  <div className={`absolute left-4 top-1.5 w-4 h-4 rounded-full -translate-x-1/2 ${c.dot}`} />

                  {/* Date badge */}
                  <div className={`inline-flex items-center gap-3 mb-4 px-3 py-1.5 rounded-lg border ${c.badge}`}>
                    <span className={`font-mono text-sm font-bold ${c.date}`}>{day.date}</span>
                    <span className="text-slate-500 text-xs font-mono">·</span>
                    <span className="text-slate-400 text-xs font-mono">{day.day}</span>
                  </div>

                  {/* Events */}
                  <div className="space-y-3">
                    {day.events.map((ev, ei) => (
                      <div key={ei} className={`card-glow rounded-xl p-5 border-l-2 ${c.border}`}>
                        <div className="flex items-start gap-4">
                          <span className={`font-mono text-xs font-bold shrink-0 mt-0.5 ${c.date}`}>{ev.time}</span>
                          <div>
                            <p className="text-white font-semibold text-sm">{ev.title}</p>
                            <p className="text-slate-400 text-xs font-mono mt-1 leading-relaxed">{ev.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rules block */}
        <div className="mt-12 card-glow rounded-xl p-6">
          <p className="text-xs font-mono text-cyan-300 tracking-widest uppercase mb-4">Формат участия</p>
          <ul className="space-y-2 text-sm text-slate-300 font-mono">
            {[
              '1–5 участников в команде',
              'Онлайн-формат, любое устройство',
              'Шифры, логика, двоичный код',
              'Тур 2 доступен только после прохождения Тура 1',
              'Призы за топ-3 места в итоговом рейтинге',
            ].map(item => (
              <li key={item} className="flex items-center gap-3">
                <span className="text-cyan-500 shrink-0">▸</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-cyan-300 transition-colors font-mono">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}

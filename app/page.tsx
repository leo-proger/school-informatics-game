'use client';

import Link from 'next/link';
import { useAuth } from '@/app/lib/auth-context';

export default function HomePage() {
  const { team } = useAuth();

  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-35 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
      <div className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6d28d9, transparent)' }} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">

        {/* Badge */}
        <div className="mb-8 px-4 py-1.5 rounded-full border border-purple-500/40 text-xs tracking-widest text-purple-300 uppercase"
          style={{ background: 'rgba(168, 85, 247, 0.08)' }}>
          ◈ NEXUS HACKATHON 2026 · 06.06 — 20.06 ◈
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.4em] text-blue-300 uppercase mb-3 font-mono">/ПРОТОКОЛ/</p>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-2 neon-text">
            ФЕНИКС
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-purple-300/60 text-sm tracking-widest font-mono">PROTOCOL</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500" />
          </div>
        </div>

        {/* Story card */}
        <div className="card-glow rounded-xl p-6 sm:p-8 max-w-2xl w-full mb-10 scanline relative overflow-hidden">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <p className="text-xs font-mono text-green-400 tracking-widest uppercase">Входящее сообщение · Phoenix Corps</p>
          </div>
          <div className="space-y-3 font-mono text-sm text-slate-100 leading-relaxed">
            <p>
              <span className="text-purple-300">[2031]</span> Международная цифровая инфраструктура объединена в единую сеть{' '}
              <span className="text-blue-300 font-semibold">NEXUS</span> — она обслуживает энергосистемы, транспорт, медицину и архивы знаний 50+ стран.
            </p>
            <p>
              Внезапно NEXUS атакует самообучающийся вирус{' '}
              <span className="text-red-400 font-semibold flicker">VOID</span>: он не уничтожает данные — он их{' '}
              <span className="text-yellow-400">искажает</span>. Алгоритмы дают неверные результаты. Шифры ломаются. Маршрутизация сходит с ума.
            </p>
            <p>
              Организация <span className="text-purple-300 font-semibold">Phoenix Corps</span> вербует команды молодых специалистов, которые мыслят нестандартно.
            </p>
            <div className="mt-4 pt-4 border-t border-purple-500/20 text-purple-300">
              Добро пожаловать. Вы были выбраны для уничтожения вируса{' '}
              <span className="text-red-400 flicker">VOID</span>.
            </div>
          </div>
        </div>

        {/* CTA */}
        {team ? (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/tasks"
              className="btn-solid px-8 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase">
              Начать миссию →
            </Link>
            <Link href="/leaderboard"
              className="btn-neon px-8 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase">
              Рейтинг команд
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/register"
              className="btn-solid px-8 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase">
              Зарегистрироваться
            </Link>
            <Link href="/login"
              className="btn-neon px-8 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase">
              Уже есть команда? Войти
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-6 sm:gap-12 text-center">
          {[
            { value: '2', label: 'Тура' },
            { value: '14', label: 'Заданий' },
            { value: '15', label: 'Дней' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-black text-purple-300 neon-text">{stat.value}</div>
              <div className="text-xs text-slate-300 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

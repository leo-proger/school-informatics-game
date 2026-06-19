'use client';

import { useState } from 'react';
import Link from 'next/link';
import Background from '@/app/components/layout/Background';

interface RuleSection {
  id: string;
  title: string;
  tag: string;
  color: 'cyan' | 'red' | 'yellow';
  items: string[];
}

const sections: RuleSection[] = [
  {
    id: 'teams',
    title: 'Участие и команды',
    tag: 'ACCESS',
    color: 'cyan',
    items: [
      'Участвовать можно в одиночку или командой от 1 до 5 человек.',
      'У одной команды только один ID. Нельзя одновременно состоять в нескольких командах.',
      'Состав команды можно изменить не более 1 раза — до начала олимпиады.',
    ],
  },
  {
    id: 'round1',
    title: 'Тур 1 — сбор букв',
    tag: 'ROUND 1',
    color: 'cyan',
    items: [
      'Решайте задания строго в рамках олимпиады: используйте только предоставленные файлы, логи и условия.',
      'Нельзя делиться ответами между командами, использовать внешних ИИ-помощников и искать готовые решения в интернете.',
      'Время сдачи фиксируется автоматически. После дедлайна ответы не принимаются.',
      'За каждое верно решённое задание команда получает букву кода.',
    ],
  },
  {
    id: 'round2',
    title: 'Тур 2 — битва с боссом',
    tag: 'ROUND 2',
    color: 'red',
    items: [
      'Тур начинается сразу после завершения Тура 1, время ограничено.',
      'Для финального задания обязательно нужен собранный код — набор букв из Тура 1.',
      'Необходимо сдать финальный ответ до окончания времени.',
    ],
  },
  {
    id: 'scoring',
    title: 'Очки и прогресс',
    tag: 'SCORE',
    color: 'yellow',
    items: [
      'Баллы за Тур 1: чем быстрее решена задача, тем больше очков.',
      'За каждую неверную попытку — вычет баллов.',
      'Итоги подводятся по двум критериям: правильный финальный ответ, затем баллы и скорость.',
    ],
  },
  {
    id: 'general',
    title: 'Общие правила',
    tag: 'SYSTEM',
    color: 'cyan',
    items: [
      'Соблюдайте этику общения.',
      'О технических проблемах (не грузится файл, не видно задание) сразу сообщайте модераторам.',
      'Все спорные ситуации решаются организаторами окончательно.',
      'Нарушение правил честности: предупреждение, при повторе — дисквалификация.',
    ],
  },
];

const colorMap = {
  cyan: { tag: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10', bullet: 'text-cyan-500', glow: 'border-cyan-500/30' },
  red: { tag: 'text-red-300 border-red-500/30 bg-red-500/10', bullet: 'text-red-500', glow: 'border-red-500/30' },
  yellow: { tag: 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10', bullet: 'text-yellow-500', glow: 'border-yellow-500/30' },
} as const;

export default function RulesPage() {
  const [open, setOpen] = useState<string | null>(sections[0].id);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-mono tracking-[0.4em] text-cyan-400 uppercase mb-3">/PROTOCOL PHOENIX/</p>
          <h1 className="text-4xl font-black neon-text mb-2">ПРАВИЛА ИГРЫ</h1>
          <p className="text-sm text-slate-400 font-mono">Прочитайте перед стартом — это поможет пройти оба тура</p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {sections.map(section => {
            const c = colorMap[section.color];
            const isOpen = open === section.id;
            return (
              <div key={section.id} className={`card-glow rounded-xl border-l-2 ${c.glow} overflow-hidden`}>
                <button
                  onClick={() => setOpen(isOpen ? null : section.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`shrink-0 font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded border ${c.tag}`}>
                      {section.tag}
                    </span>
                    <span className="text-white font-semibold text-sm sm:text-base truncate">{section.title}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <ul className="space-y-2.5 px-5 pb-5 text-sm text-slate-300 font-mono leading-relaxed">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <span className={`shrink-0 ${c.bullet}`}>▸</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer links */}
        <div className="mt-10 flex items-center justify-center gap-6 text-xs font-mono">
          <Link href="/schedule" className="text-slate-500 hover:text-cyan-300 transition-colors">Расписание →</Link>
          <Link href="/" className="text-slate-500 hover:text-cyan-300 transition-colors">← На главную</Link>
        </div>
      </div>
    </div>
  );
}

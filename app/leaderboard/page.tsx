'use client';

import { useState } from 'react';
import { useAuth } from '@/app/lib/auth-context';
import { MOCK_LEADERBOARD, MockTeam } from '@/app/lib/mock-data';

type FilterType = 'country' | 'city' | 'school';

function getRankStyle(rank: number) {
  if (rank === 1) return 'rank-1';
  if (rank === 2) return 'rank-2';
  if (rank === 3) return 'rank-3';
  return 'text-slate-300';
}

function getRankIcon(rank: number) {
  if (rank === 1) return '◆';
  if (rank === 2) return '◇';
  if (rank === 3) return '◈';
  return `#${rank}`;
}

export default function LeaderboardPage() {
  const { team } = useAuth();
  const [filter, setFilter] = useState<FilterType>('country');
  const [search, setSearch] = useState('');

  const filterLabel: Record<FilterType, string> = {
    country: 'По стране',
    city: 'По городу',
    school: 'По школе',
  };

  const filterKey: Record<FilterType, keyof MockTeam> = {
    country: 'country',
    city: 'city',
    school: 'school',
  };

  // Group and aggregate scores
  const grouped = MOCK_LEADERBOARD.reduce<Record<string, { name: string; teams: number; totalScore: number; top3: string[] }>>((acc, t) => {
    const key = String(t[filterKey[filter]]);
    if (!acc[key]) acc[key] = { name: key, teams: 0, totalScore: 0, top3: [] };
    acc[key].teams++;
    acc[key].totalScore += t.score;
    if (acc[key].top3.length < 3) acc[key].top3.push(t.name);
    return acc;
  }, {});

  const groupedList = Object.values(grouped)
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((g, i) => ({ ...g, rank: i + 1 }));

  const filteredTeams = MOCK_LEADERBOARD
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.school.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.rank - b.rank);

  return (
    <div className="min-h-screen cyber-grid px-4 py-10 relative overflow-hidden">
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono tracking-[0.4em] text-blue-300 uppercase mb-2">/NEXUS БАЗА ДАННЫХ/</p>
          <h1 className="text-4xl font-black neon-text mb-3">РЕЙТИНГ</h1>
          <p className="text-sm text-slate-300 font-mono">Актуальные результаты хакатона · {MOCK_LEADERBOARD.length} команд</p>
        </div>

        {/* Current team rank */}
        {team && (
          <div className="card-glow neon-border rounded-xl p-5 mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-purple-300 uppercase tracking-widest mb-1">Ваша команда</p>
              <p className="text-lg font-bold text-white">{team.name}</p>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                {team.participants[0]?.school} · {team.participants[0]?.city}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono text-slate-300 mb-1">ОЧКИ</p>
              <p className="text-3xl font-black text-purple-300 neon-text">{team.score}</p>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(Object.keys(filterLabel) as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                ${filter === f
                  ? 'border-purple-500/50 text-purple-200 bg-purple-500/10'
                  : 'border-gray-700/50 text-slate-300 hover:border-purple-500/30 hover:text-slate-100'
                }`}
            >
              {filterLabel[f]}
            </button>
          ))}
        </div>

        {/* Grouped rankings */}
        <div className="card-glow rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-purple-500/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">
              Рейтинг · {filterLabel[filter]}
            </h2>
            <span className="text-xs font-mono text-slate-400">{groupedList.length} позиций</span>
          </div>
          <div className="divide-y divide-purple-500/8">
            {groupedList.map((g) => (
              <div key={g.name} className="px-6 py-4 flex items-center gap-4 hover:bg-purple-500/5 transition-colors">
                <div className={`w-10 text-center font-black text-lg ${getRankStyle(g.rank)}`}>
                  {getRankIcon(g.rank)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{g.name}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {g.teams} {g.teams === 1 ? 'команда' : 'команд(ы)'} · {g.top3.slice(0, 2).join(', ')}{g.top3.length > 2 && '...'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-purple-300 font-mono">{g.totalScore}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">очков</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All teams table */}
        <div className="card-glow rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-500/10 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">Все команды</h2>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по команде, школе, городу..."
              className="input-neon px-3 py-1.5 rounded-lg text-xs w-56"
            />
          </div>

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-purple-500/5">
            <span className="col-span-1">#</span>
            <span className="col-span-3">Команда</span>
            <span className="col-span-3">Школа</span>
            <span className="col-span-2">Город</span>
            <span className="col-span-2 text-center">Туры</span>
            <span className="col-span-1 text-right">Очки</span>
          </div>

          <div className="divide-y divide-purple-500/5">
            {filteredTeams.map(t => (
              <div key={t.rank}
                className={`px-6 py-4 transition-colors hover:bg-purple-500/5
                  ${t.rank <= 3 ? 'bg-purple-500/3' : ''}`}
              >
                {/* Mobile layout */}
                <div className="sm:hidden flex items-center gap-3">
                  <span className={`text-lg font-black w-8 shrink-0 ${getRankStyle(t.rank)}`}>
                    {getRankIcon(t.rank)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                    <p className="text-xs text-slate-400 truncate">{t.school} · {t.city}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-purple-300 font-mono text-sm">{t.score}</p>
                    <div className="flex gap-1 justify-end mt-1">
                      <span className={`text-[9px] px-1 rounded ${t.tour1 ? 'bg-green-500/20 text-green-500' : 'bg-gray-700/30 text-slate-400'}`}>T1</span>
                      <span className={`text-[9px] px-1 rounded ${t.tour2 ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-700/30 text-slate-400'}`}>T2</span>
                    </div>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                  <span className={`col-span-1 font-black text-base ${getRankStyle(t.rank)}`}>
                    {getRankIcon(t.rank)}
                  </span>
                  <span className="col-span-3 text-sm font-semibold text-white truncate">{t.name}</span>
                  <span className="col-span-3 text-xs text-slate-200 truncate">{t.school}</span>
                  <span className="col-span-2 text-xs text-slate-300">{t.city}</span>
                  <div className="col-span-2 flex gap-1.5 justify-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono
                      ${t.tour1 ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-gray-700/20 text-slate-400 border border-gray-700/30'}`}>
                      Т1
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono
                      ${t.tour2 ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20' : 'bg-gray-700/20 text-slate-400 border border-gray-700/30'}`}>
                      Т2
                    </span>
                  </div>
                  <span className="col-span-1 text-right font-bold text-purple-300 font-mono">{t.score}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredTeams.length === 0 && (
            <div className="py-10 text-center text-slate-400 font-mono text-sm">
              Команды не найдены
            </div>
          )}
        </div>

        {/* Last updated */}
        <p className="text-center text-xs text-slate-400 font-mono mt-6">
          Обновлено: {new Date().toLocaleString('ru-RU')} · NEXUS DataBase v4.2.1
        </p>
      </div>
    </div>
  );
}

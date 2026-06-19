'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/lib/auth-context';
import { supabase } from '@/app/lib/supabase';
import Background from '@/app/components/layout/Background';

interface LeaderboardTeam {
  id: string;
  name: string;
  school: string;
  city: string;
  score: number;
  tour1: boolean;
  tour2: boolean;
  isAdmin: boolean;
}

type FilterType = 'city' | 'school';

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

async function fetchLeaderboard(): Promise<LeaderboardTeam[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('id, name, score, is_admin, tour1_completed, tour2_completed, participants(city, school)')
    .order('score', { ascending: false });

  if (error || !data) return [];

  return data.map(row => {
    const participants = (row.participants as { city: string; school: string }[]) ?? [];
    const first = participants[0];
    return {
      id: row.id,
      name: row.name,
      school: first?.school ?? '',
      city: first?.city ?? '',
      score: row.score ?? 0,
      tour1: row.tour1_completed ?? false,
      tour2: row.tour2_completed ?? false,
      isAdmin: row.is_admin ?? false,
    };
  });
}

export default function LeaderboardPage() {
  const { team } = useAuth();
  const [filter, setFilter] = useState<FilterType>('city');
  const [search, setSearch] = useState('');
  const [allTeams, setAllTeams] = useState<LeaderboardTeam[]>([]);
  const [showAdmins, setShowAdmins] = useState(false);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [teams, { data: settingRow }] = await Promise.all([
      fetchLeaderboard(),
      supabase.from('settings').select('value').eq('key', 'leaderboard_show_admins').single(),
    ]);
    setAllTeams(teams);
    setShowAdmins(settingRow?.value === 'true');
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload(); // async — setState runs after Promise resolves, not synchronously

    const channel = supabase
      .channel('leaderboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, reload)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings', filter: 'key=eq.leaderboard_show_admins' }, reload)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [reload]);

  const visibleTeams = allTeams.filter(t => showAdmins || !t.isAdmin);

  const rankedTeams = visibleTeams.map((t, i) => ({ ...t, rank: i + 1 }));

  const filterLabel: Record<FilterType, string> = {
    city: 'По городу',
    school: 'По школе',
  };

  const filterKey: Record<FilterType, keyof LeaderboardTeam> = {
    city: 'city',
    school: 'school',
  };

  const grouped = rankedTeams.reduce<Record<string, { name: string; teams: number; totalScore: number; top3: string[] }>>((acc, t) => {
    const key = String(t[filterKey[filter]]) || '—';
    if (!acc[key]) acc[key] = { name: key, teams: 0, totalScore: 0, top3: [] };
    acc[key].teams++;
    acc[key].totalScore += t.score;
    if (acc[key].top3.length < 3) acc[key].top3.push(t.name);
    return acc;
  }, {});

  const groupedList = Object.values(grouped)
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((g, i) => ({ ...g, rank: i + 1 }));

  const filteredTeams = rankedTeams
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.school.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase()));

  const myTeamLive = allTeams.find(t => t.id === team?.id);
  const myRank = rankedTeams.findIndex(t => t.id === team?.id);
  const myLiveScore = myTeamLive?.score ?? team?.score ?? 0;
  const myTour1 = myTeamLive?.tour1 ?? team?.tour1Completed ?? false;
  const myTour2 = myTeamLive?.tour2 ?? team?.tour2Completed ?? false;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">

        <div className="mb-8 text-center">
          <p className="text-xs font-mono tracking-[0.4em] text-cyan-400 uppercase mb-2">/NEXUS БАЗА ДАННЫХ/</p>
          <h1 className="text-4xl font-black neon-text mb-2">РЕЙТИНГ КОМАНД</h1>
          <p className="text-sm text-slate-400 font-mono">
            {loading ? 'Загрузка...' : `${visibleTeams.length} команд · Актуальные результаты хакатона`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mb-6">

          {/* Left: current team */}
          <div className="card-glow rounded-xl p-5 flex flex-col gap-4">
            <p className="text-xs font-mono text-cyan-300 tracking-widest uppercase">Рейтинг команды</p>

            {team ? (
              <>
                <div className="border-b border-cyan-500/15 pb-4">
                  <p className="text-lg font-bold text-white leading-tight">{team.name}</p>
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <p className="text-xs text-slate-400 font-mono">{team.participants[0]?.school}</p>
                      {myRank >= 0 && (
                        <p className="text-xs text-cyan-400 font-mono mt-1">
                          #{myRank + 1} в общем рейтинге
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-cyan-300 neon-text">{myLiveScore}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">очков</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Участники</p>
                  <ul className="space-y-1.5">
                    {team.participants.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-cyan-400 shrink-0">◈</span>
                        <span className="text-slate-200 truncate">{p.fullName}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-3 border-t border-cyan-500/10 flex gap-2">
                  <span className={`text-[10px] px-2 py-1 rounded font-mono border flex-1 text-center
                    ${myTour1 ? 'bg-green-500/15 text-green-400 border-green-500/20' : 'bg-gray-700/20 text-slate-500 border-gray-700/30'}`}>
                    Тур 1 {myTour1 ? '✓' : '—'}
                  </span>
                  <span className={`text-[10px] px-2 py-1 rounded font-mono border flex-1 text-center
                    ${myTour2 ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20' : 'bg-gray-700/20 text-slate-500 border-gray-700/30'}`}>
                    Тур 2 {myTour2 ? '✓' : '—'}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center gap-3">
                <span className="text-3xl text-slate-600">◈</span>
                <p className="text-xs text-slate-500 font-mono leading-relaxed">
                  Войдите в аккаунт,<br />чтобы увидеть<br />рейтинг своей команды
                </p>
              </div>
            )}
          </div>

          {/* Right: all teams leaderboard */}
          <div className="card-glow rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-cyan-500/10 flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">
                Все команды
              </h2>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск..."
                className="input-neon px-3 py-1.5 rounded-lg text-xs w-48"
              />
            </div>

            <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest border-b border-cyan-500/5">
              <span className="col-span-1">#</span>
              <span className="col-span-4">Название</span>
              <span className="col-span-3">Школа</span>
              <span className="col-span-2">Город</span>
              <span className="col-span-1 text-center">Туры</span>
              <span className="col-span-1 text-right">Очки</span>
            </div>

            <div className="divide-y divide-cyan-500/5 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="py-10 text-center text-slate-400 font-mono text-sm">Загрузка...</div>
              ) : filteredTeams.length === 0 ? (
                <div className="py-10 text-center text-slate-400 font-mono text-sm">Команды не найдены</div>
              ) : filteredTeams.map(t => (
                <div key={t.id}
                  className={`px-5 py-3 transition-colors hover:bg-cyan-500/5 ${t.rank <= 3 ? 'bg-cyan-500/3' : ''} ${t.id === team?.id ? 'bg-cyan-500/8 border-l-2 border-cyan-400' : ''}`}>
                  {/* Mobile */}
                  <div className="sm:hidden flex items-center gap-3">
                    <span className={`text-base font-black w-8 shrink-0 ${getRankStyle(t.rank)}`}>{getRankIcon(t.rank)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                      <p className="text-xs text-slate-400 truncate">{t.school} · {t.city}</p>
                    </div>
                    <p className="font-bold text-cyan-300 font-mono text-sm shrink-0">{t.score}</p>
                  </div>
                  {/* Desktop */}
                  <div className="hidden sm:grid grid-cols-12 gap-3 items-center">
                    <span className={`col-span-1 font-black text-base ${getRankStyle(t.rank)}`}>{getRankIcon(t.rank)}</span>
                    <span className="col-span-4 text-sm font-semibold text-white truncate">{t.name}</span>
                    <span className="col-span-3 text-xs text-slate-300 truncate">{t.school}</span>
                    <span className="col-span-2 text-xs text-slate-400">{t.city}</span>
                    <div className="col-span-1 flex gap-1 justify-center">
                      <span className={`text-[9px] px-1 py-0.5 rounded font-mono border
                        ${t.tour1 ? 'bg-green-500/15 text-green-400 border-green-500/20' : 'bg-gray-700/20 text-slate-500 border-gray-700/30'}`}>T1</span>
                      <span className={`text-[9px] px-1 py-0.5 rounded font-mono border
                        ${t.tour2 ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20' : 'bg-gray-700/20 text-slate-500 border-gray-700/30'}`}>T2</span>
                    </div>
                    <span className="col-span-1 text-right font-bold text-cyan-300 font-mono text-sm">{t.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* Left: filter selector + stats */}
          <div className="card-glow rounded-xl p-5 flex flex-col gap-4">
            <p className="text-xs font-mono text-cyan-300 tracking-widest uppercase mb-1">Группировка</p>
            <div className="flex flex-col gap-2">
              {(Object.keys(filterLabel) as FilterType[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-mono text-left transition-all duration-200 border
                    ${filter === f
                      ? 'border-cyan-500/50 text-cyan-200 bg-cyan-500/10'
                      : 'border-gray-700/40 text-slate-400 hover:border-cyan-500/30 hover:text-slate-200'
                    }`}
                >
                  {filterLabel[f]}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-cyan-500/10">
              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-2">Статистика</p>
              <div className="space-y-1.5 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Всего команд</span>
                  <span className="text-slate-300">{visibleTeams.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Прошли Тур 1</span>
                  <span className="text-cyan-400">{visibleTeams.filter(t => t.tour1).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Прошли Тур 2</span>
                  <span className="text-sky-400">{visibleTeams.filter(t => t.tour2).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: grouped ranking */}
          <div className="card-glow rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-cyan-500/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-widest">
                Рейтинг · {filterLabel[filter]}
              </h2>
              <span className="text-xs font-mono text-slate-400">{groupedList.length} позиций</span>
            </div>
            <div className="divide-y divide-cyan-500/5">
              {groupedList.map((g) => (
                <div key={g.name} className="px-5 py-4 flex items-center gap-4 hover:bg-cyan-500/5 transition-colors">
                  <div className={`w-10 text-center font-black text-lg shrink-0 ${getRankStyle(g.rank)}`}>
                    {getRankIcon(g.rank)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{g.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {g.teams} {g.teams === 1 ? 'команда' : 'команд(ы)'} · {g.top3.slice(0, 2).join(', ')}{g.top3.length > 2 && '...'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-cyan-300 font-mono text-base">{g.totalScore}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">очков</p>
                  </div>
                </div>
              ))}
              {groupedList.length === 0 && !loading && (
                <div className="py-10 text-center text-slate-400 font-mono text-sm">Нет данных</div>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 font-mono mt-8" suppressHydrationWarning>
          Обновлено: {new Date().toLocaleString('ru-RU')} · NEXUS DataBase v4.2.1
        </p>
      </div>
    </div>
  );
}

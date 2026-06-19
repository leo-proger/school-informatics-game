"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";
import { supabase } from "@/app/lib/supabase";
import Background from "@/app/components/layout/Background";
import { Setting, groupSettings, isBooleanKey } from "@/app/lib/settings-utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Participant {
  id: string;
  team_id: string;
  full_name: string;
  city: string;
  school: string;
}

interface Team {
  id: string;
  name: string;
  password: string;
  is_admin: boolean;
  score: number;
  tour1_completed: boolean;
  tour2_completed: boolean;
  registered_at: string;
  participants?: Participant[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  answer: string;
  hint: string;
  difficulty: "easy" | "medium" | "hard" | "boss";
  time_limit: number;
  task_number: number;
  tour: 1 | 2;
  task_type: "regular" | "boss";
  min_team_size: number;
  short_title: string | null;
  options: string | null;
}

type Tab = "teams" | "tasks" | "settings";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Лёгкий",
  medium: "Средний",
  hard: "Сложный",
  boss: "Босс",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-orange-400",
  boss: "text-red-400",
};

function Input({ label, value, onChange, type = "text", rows }: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; rows?: number;
}) {
  const base = "w-full bg-black/60 border border-cyan-500/20 rounded px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/60 transition-colors";
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      {rows ? (
        <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className={base} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className={base} />
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-black/60 border border-cyan-500/20 rounded px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/60 transition-colors">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a0a1a] border border-red-500/30 rounded-xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-12 h-12 rounded-full border border-red-500/40 bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <p className="text-slate-200 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onConfirm} className="px-5 py-2 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-sm hover:bg-red-500/30 transition-colors">Удалить</button>
          <button onClick={onCancel} className="px-5 py-2 rounded bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors">Отмена</button>
        </div>
      </div>
    </div>
  );
}

// ─── Teams Tab ────────────────────────────────────────────────────────────────

function TeamsTab() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<Team | null>(null);
  const [editParticipant, setEditParticipant] = useState<Participant | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "team" | "participant"; id: string; name: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data: teamRows } = await supabase.from("teams").select("*").order("score", { ascending: false });
    const { data: participantRows } = await supabase.from("participants").select("*");
    const teamsWithPart = (teamRows ?? []).map(t => ({
      ...t,
      participants: (participantRows ?? []).filter(p => p.team_id === t.id),
    }));
    setTeams(teamsWithPart);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const saveTeam = async () => {
    if (!editing) return;
    setSaving(true);
    await supabase.from("teams").update({
      name: editing.name,
      password: editing.password,
      score: editing.score,
      is_admin: editing.is_admin,
      tour1_completed: editing.tour1_completed,
      tour2_completed: editing.tour2_completed,
    }).eq("id", editing.id);
    setSaving(false);
    setEditing(null);
    load();
  };

  const saveParticipant = async () => {
    if (!editParticipant) return;
    setSaving(true);
    await supabase.from("participants").update({
      full_name: editParticipant.full_name,
      city: editParticipant.city,
      school: editParticipant.school,
    }).eq("id", editParticipant.id);
    setSaving(false);
    setEditParticipant(null);
    load();
  };

  const deleteTeam = async (id: string) => {
    await supabase.from("participants").delete().eq("team_id", id);
    await supabase.from("teams").delete().eq("id", id);
    setConfirmDelete(null);
    load();
  };

  const resetTeam = async (id: string, to: "tour1" | "tour2") => {
    if (to === "tour1") {
      await supabase.from("teams").update({ score: 0, tour1_completed: false, tour2_completed: false }).eq("id", id);
    } else {
      await supabase.from("teams").update({ tour2_completed: false }).eq("id", id);
    }
    setConfirmReset(null);
    load();
  };

  const deleteParticipant = async (id: string) => {
    await supabase.from("participants").delete().eq("id", id);
    setConfirmDelete(null);
    load();
  };

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" /></div>;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Команд", value: teams.length },
          { label: "Участников", value: teams.reduce((s, t) => s + (t.participants?.length ?? 0), 0) },
          { label: "Ср. счёт", value: teams.length ? Math.round(teams.reduce((s, t) => s + t.score, 0) / teams.length) : 0 },
        ].map(s => (
          <div key={s.label} className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-black text-cyan-300">{s.value}</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Поиск по названию..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-black/60 border border-cyan-500/20 rounded px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/60 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-cyan-500/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cyan-500/20 bg-cyan-500/5">
              {["Команда", "Участников", "Счёт", "Тур 1", "Тур 2", "Адм.", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((team, i) => (
              <React.Fragment key={team.id}>
                <tr
                  className={`border-b border-cyan-500/10 cursor-pointer transition-colors ${expanded === team.id ? "bg-cyan-500/8" : "hover:bg-white/3"} ${i % 2 === 0 ? "" : "bg-white/1"}`}
                  onClick={() => setExpanded(expanded === team.id ? null : team.id)}
                >
                  <td className="px-4 py-3 font-medium text-slate-100">
                    <div className="flex items-center gap-2">
                      <span>{team.name}</span>
                      {team.is_admin && <span className="text-xs text-yellow-400 border border-yellow-400/30 px-1.5 py-0.5 rounded">ADMIN</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{team.participants?.length ?? 0}</td>
                  <td className="px-4 py-3 text-cyan-300 font-mono font-bold">{team.score}</td>
                  <td className="px-4 py-3">{team.tour1_completed ? <span className="text-green-400">✓</span> : <span className="text-slate-600">—</span>}</td>
                  <td className="px-4 py-3">{team.tour2_completed ? <span className="text-green-400">✓</span> : <span className="text-slate-600">—</span>}</td>
                  <td className="px-4 py-3">{team.is_admin ? <span className="text-yellow-400">✓</span> : <span className="text-slate-600">—</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setEditing({ ...team })} className="px-3 py-1 rounded text-xs border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors">Ред.</button>
                      <button onClick={() => setConfirmReset({ id: team.id, name: team.name })} className="px-3 py-1 rounded text-xs border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-colors">Сбр.</button>
                      <button onClick={() => setConfirmDelete({ type: "team", id: team.id, name: team.name })} className="px-3 py-1 rounded text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">Уд.</button>
                      <svg
                        className={`w-4 h-4 text-slate-400 ml-1 transition-transform duration-200 ${expanded === team.id ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </td>
                </tr>

                {expanded === team.id && (
                  <tr key={`${team.id}-exp`} className="bg-cyan-500/5">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Участники</div>
                      {(team.participants ?? []).length === 0 ? (
                        <p className="text-slate-600 text-sm">Нет участников</p>
                      ) : (
                        <div className="space-y-2">
                          {(team.participants ?? []).map(p => (
                            <div key={p.id} className="flex items-center justify-between bg-black/30 rounded px-4 py-2 text-sm">
                              <div>
                                <span className="text-slate-100">{p.full_name}</span>
                                <span className="text-slate-500 ml-3">{p.city} · {p.school}</span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setEditParticipant({ ...p })} className="px-2 py-1 rounded text-xs border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors">Ред.</button>
                                <button onClick={() => setConfirmDelete({ type: "participant", id: p.id, name: p.full_name })} className="px-2 py-1 rounded text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">Уд.</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Team Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a1a] border border-cyan-500/30 rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-6">Редактировать команду</h3>
            <div className="space-y-4">
              <Input label="Название" value={editing.name} onChange={v => setEditing({ ...editing, name: v })} />
              <Input label="Пароль" value={editing.password} onChange={v => setEditing({ ...editing, password: v })} />
              <Input label="Счёт" type="number" value={editing.score} onChange={v => setEditing({ ...editing, score: Number(v) })} />
              <div className="flex gap-6">
                {[
                  { key: "tour1_completed" as const, label: "Тур 1 завершён" },
                  { key: "tour2_completed" as const, label: "Тур 2 завершён" },
                  { key: "is_admin" as const, label: "Администратор" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editing[key]} onChange={e => setEditing({ ...editing, [key]: e.target.checked })} className="w-4 h-4 accent-cyan-400" />
                    <span className="text-sm text-slate-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveTeam} disabled={saving} className="px-5 py-2 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors disabled:opacity-50">
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
              <button onClick={() => setEditing(null)} className="px-5 py-2 rounded bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Participant Modal */}
      {editParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a1a] border border-cyan-500/30 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-6">Редактировать участника</h3>
            <div className="space-y-4">
              <Input label="Имя" value={editParticipant.full_name} onChange={v => setEditParticipant({ ...editParticipant, full_name: v })} />
              <Input label="Город" value={editParticipant.city} onChange={v => setEditParticipant({ ...editParticipant, city: v })} />
              <Input label="Школа" value={editParticipant.school} onChange={v => setEditParticipant({ ...editParticipant, school: v })} />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={saveParticipant} disabled={saving} className="px-5 py-2 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors disabled:opacity-50">
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
              <button onClick={() => setEditParticipant(null)} className="px-5 py-2 rounded bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <ConfirmDialog
          message={`Удалить ${confirmDelete.type === "team" ? "команду" : "участника"} «${confirmDelete.name}»? Это действие необратимо.`}
          onConfirm={() => confirmDelete.type === "team" ? deleteTeam(confirmDelete.id) : deleteParticipant(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Reset Progress Dialog */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a1a] border border-yellow-500/30 rounded-xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 rounded-full border border-yellow-500/40 bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-slate-200 text-sm mb-2">Сбросить прогресс команды</p>
            <p className="text-yellow-400 font-semibold mb-6">«{confirmReset.name}»</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => resetTeam(confirmReset.id, "tour1")}
                className="px-5 py-3 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-sm hover:bg-red-500/30 transition-colors text-left"
              >
                <div className="font-semibold">↩ До тура 1</div>
                <div className="text-xs text-red-400/70 mt-0.5">Очки → 0, оба тура не пройдены</div>
              </button>
              <button
                onClick={() => resetTeam(confirmReset.id, "tour2")}
                className="px-5 py-3 rounded bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-sm hover:bg-yellow-500/30 transition-colors text-left"
              >
                <div className="font-semibold">↩ До тура 2</div>
                <div className="text-xs text-yellow-400/70 mt-0.5">Тур 1 сохранён, тур 2 сброшен</div>
              </button>
              <button
                onClick={() => setConfirmReset(null)}
                className="px-5 py-2 rounded bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tasks Tab ────────────────────────────────────────────────────────────────

const EMPTY_TASK: Task = {
  id: "", title: "", description: "", answer: "", hint: "",
  difficulty: "medium", time_limit: 300, task_number: 1, tour: 1, task_type: "regular", min_team_size: 1,
  short_title: null, options: null,
};

function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [tourFilter, setTourFilter] = useState<1 | 2>(1);
  const [editing, setEditing] = useState<Task | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("tasks").select("*").order("tour").order("task_number");
    setTasks((data ?? []) as Task[]);
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    if (isNew) {
      await supabase.from("tasks").insert(editing);
    } else {
      await supabase.from("tasks").update({
        title: editing.title, description: editing.description, answer: editing.answer,
        hint: editing.hint, difficulty: editing.difficulty, time_limit: editing.time_limit,
        task_number: editing.task_number, tour: editing.tour, task_type: editing.task_type,
        min_team_size: editing.min_team_size,
        short_title: editing.short_title || null,
        options: editing.options || null,
      }).eq("id", editing.id);
    }
    setSaving(false);
    setEditing(null);
    setIsNew(false);
    load();
  };

  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    setConfirmDelete(null);
    load();
  };

  const filtered = tasks.filter(t => t.tour === tourFilter);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {([1, 2] as const).map(t => (
            <button key={t} onClick={() => setTourFilter(t)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${tourFilter === t ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300" : "border border-white/10 text-slate-400 hover:text-slate-200"}`}>
              Тур {t}
            </button>
          ))}
        </div>
        <button onClick={() => { setEditing({ ...EMPTY_TASK, tour: tourFilter, id: `task-${Date.now()}` }); setIsNew(true); }}
          className="px-4 py-2 rounded text-sm border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors">
          + Добавить задание
        </button>
      </div>

      <div className="rounded-xl border border-cyan-500/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cyan-500/20 bg-cyan-500/5">
              {["#", "Название", "Тип", "Сложность", "Лимит (сек)", "Мин. игроков", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-slate-400 uppercase tracking-wider font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((task, i) => (
              <tr key={task.id} className={`border-b border-cyan-500/10 ${i % 2 === 0 ? "" : "bg-white/1"}`}>
                <td className="px-4 py-3 text-slate-500 font-mono">{task.task_number}</td>
                <td className="px-4 py-3 text-slate-100 font-medium max-w-xs truncate">{task.title}</td>
                <td className="px-4 py-3 text-slate-400">{task.task_type === "boss" ? "🔴 Босс" : "Обычное"}</td>
                <td className={`px-4 py-3 ${DIFFICULTY_COLORS[task.difficulty]}`}>{DIFFICULTY_LABELS[task.difficulty]}</td>
                <td className="px-4 py-3 text-slate-400 font-mono">{task.time_limit}</td>
                <td className="px-4 py-3 text-slate-400">{task.min_team_size}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing({ ...task }); setIsNew(false); }} className="px-3 py-1 rounded text-xs border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors">Ред.</button>
                    <button onClick={() => setConfirmDelete({ id: task.id, title: task.title })} className="px-3 py-1 rounded text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">Уд.</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a1a] border border-cyan-500/30 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-6">{isNew ? "Новое задание" : "Редактировать задание"}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {isNew && <Input label="ID (уникальный)" value={editing.id} onChange={v => setEditing({ ...editing, id: v })} />}
                <Input label="Номер задания" type="number" value={editing.task_number} onChange={v => setEditing({ ...editing, task_number: Number(v) })} />
                <Input label="Лимит времени (сек)" type="number" value={editing.time_limit} onChange={v => setEditing({ ...editing, time_limit: Number(v) })} />
                <Input label="Мин. участников" type="number" value={editing.min_team_size} onChange={v => setEditing({ ...editing, min_team_size: Number(v) })} />
              </div>
              {editing.tour === 2 && (
                <Input label="Короткое название (для карты)" value={editing.short_title ?? ""} onChange={v => setEditing({ ...editing, short_title: v || null })} />
              )}
              <Input label="Название" value={editing.title} onChange={v => setEditing({ ...editing, title: v })} />
              <Input label="Описание" value={editing.description} onChange={v => setEditing({ ...editing, description: v })} rows={4} />
              <Input label="Правильный ответ" value={editing.answer} onChange={v => setEditing({ ...editing, answer: v })} />
              {editing.tour === 2 && (
                <Input
                  label='Варианты ответов (JSON-массив, пример: ["Да","Нет","Может","Нет"])'
                  value={editing.options ?? ""}
                  onChange={v => setEditing({ ...editing, options: v || null })}
                  rows={3}
                />
              )}
              <Input label="Подсказка" value={editing.hint} onChange={v => setEditing({ ...editing, hint: v })} rows={2} />
              <div className="grid grid-cols-3 gap-4">
                <Select label="Тур" value={String(editing.tour)} onChange={v => setEditing({ ...editing, tour: Number(v) as 1 | 2 })}
                  options={[{ value: "1", label: "Тур 1" }, { value: "2", label: "Тур 2" }]} />
                <Select label="Тип" value={editing.task_type} onChange={v => setEditing({ ...editing, task_type: v as "regular" | "boss" })}
                  options={[{ value: "regular", label: "Обычное" }, { value: "boss", label: "Босс" }]} />
                <Select label="Сложность" value={editing.difficulty} onChange={v => setEditing({ ...editing, difficulty: v as Task["difficulty"] })}
                  options={[
                    { value: "easy", label: "Лёгкий" }, { value: "medium", label: "Средний" },
                    { value: "hard", label: "Сложный" }, { value: "boss", label: "Босс" },
                  ]} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="px-5 py-2 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors disabled:opacity-50">
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-5 py-2 rounded bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Удалить задание «${confirmDelete.title}»?`}
          onConfirm={() => deleteTask(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("*").then(({ data }) => {
      setSettings((data ?? []) as Setting[]);
      setLoading(false);
    });
  }, []);

  const update = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const save = async () => {
    setSaving(true);
    for (const s of settings) {
      await supabase.from("settings").update({ value: s.value }).eq("key", s.key);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" /></div>;

  const groups = groupSettings(settings);

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500 mb-8">Даты используются для управления доступом к турам и отображением таймеров на странице заданий.</p>

      <div className="space-y-6">
        {groups.map(group => (
          <div key={group.groupLabel} className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-6">
            <h3 className="text-xs font-mono tracking-[0.3em] text-cyan-400 uppercase mb-5">{group.groupLabel}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {group.items.map(s => (
                <div key={s.key}>
                  {isBooleanKey(s.key) ? (
                    <label className="flex items-center justify-between gap-4 cursor-pointer py-2">
                      <span className="text-sm text-slate-300">{s.label || s.key}</span>
                      <button
                        type="button"
                        onClick={() => update(s.key, s.value === 'true' ? 'false' : 'true')}
                        className={`relative w-12 h-6 rounded-full border transition-colors shrink-0 ${
                          s.value === 'true'
                            ? 'bg-cyan-500/30 border-cyan-400/60'
                            : 'bg-white/5 border-white/20'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
                          s.value === 'true'
                            ? 'left-[26px] bg-cyan-400'
                            : 'left-0.5 bg-slate-500'
                        }`} />
                      </button>
                    </label>
                  ) : (
                    <>
                      <label className="block text-xs text-slate-400 mb-1.5">{s.label || s.key}</label>
                      <input
                        type="datetime-local"
                        value={s.value ? s.value.slice(0, 16) : ""}
                        onChange={e => update(s.key, e.target.value + ":00")}
                        className="w-full bg-black/60 border border-cyan-500/20 rounded px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/60 transition-colors"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-8">
        <button onClick={save} disabled={saving} className="px-6 py-2.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm hover:bg-cyan-500/30 transition-colors disabled:opacity-50">
          {saving ? "Сохранение..." : "Сохранить настройки"}
        </button>
        {saved && <span className="text-sm text-green-400">✓ Сохранено</span>}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { key: Tab; label: string }[] = [
  { key: "teams", label: "Команды" },
  { key: "tasks", label: "Задания" },
  { key: "settings", label: "Настройки турнира" },
];

export default function AdminPage() {
  const { team, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("teams");

  useEffect(() => {
    if (!isLoading && (!team || !team.isAdmin)) {
      router.replace("/");
    }
  }, [team, isLoading, router]);

  if (isLoading || !team?.isAdmin) {
    return (
      <div className="fixed inset-0 bg-[#050816] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-16">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-mono tracking-[0.4em] text-yellow-400 uppercase mb-2">/ADMIN PANEL/</p>
          <h1 className="text-3xl font-black text-white mb-1">
            Управление <span className="text-cyan-300">ФЕНИКС</span>
          </h1>
          <p className="text-slate-500 text-sm font-mono">Вошли как: <span className="text-yellow-400">{team.name}</span></p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-cyan-500/20 pb-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
                tab === t.key
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "teams" && <TeamsTab />}
        {tab === "tasks" && <TasksTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import Background from '@/app/components/layout/Background';

interface ParticipantForm {
  fullName: string;
  city: string;
  school: string;
}

const emptyParticipant = (): ParticipantForm => ({ fullName: '', city: '', school: '' });

export default function RegisterPage() {
  const { register, team, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && team) {
      router.replace('/tasks');
    }
  }, [team, isLoading, router]);

  const [step, setStep] = useState<1 | 2>(1);
  const [teamForm, setTeamForm] = useState({ name: '', password: '', confirmPassword: '', isAdmin: false });
  const [participants, setParticipants] = useState<ParticipantForm[]>([emptyParticipant()]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!teamForm.name.trim()) { setError('Введите название команды'); return; }
    if (teamForm.name.length < 3) { setError('Название должно быть не менее 3 символов'); return; }
    if (!teamForm.password) { setError('Введите пароль'); return; }
    if (teamForm.password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return; }
    if (teamForm.password !== teamForm.confirmPassword) { setError('Пароли не совпадают'); return; }
    setStep(2);
  };

  const addParticipant = () => {
    if (participants.length < 5) setParticipants(p => [...p, emptyParticipant()]);
  };

  const removeParticipant = (i: number) => {
    if (participants.length > 1) setParticipants(p => p.filter((_, idx) => idx !== i));
  };

  const updateParticipant = (i: number, field: keyof ParticipantForm, value: string) => {
    setParticipants(p => p.map((part, idx) => idx === i ? { ...part, [field]: value } : part));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    for (const [i, p] of participants.entries()) {
      if (!p.fullName.trim()) { setError(`Участник ${i + 1}: введите ФИО`); return; }
      if (!p.city.trim()) { setError(`Участник ${i + 1}: введите город`); return; }
      if (!p.school.trim()) { setError(`Участник ${i + 1}: введите школу`); return; }
    }
    setLoading(true);
    const result = await register(
      { name: teamForm.name.trim(), password: teamForm.password, isAdmin: teamForm.isAdmin },
      participants.map(p => ({ fullName: p.fullName.trim(), city: p.city.trim(), school: p.school.trim() }))
    );
    setLoading(false);
    if (result.success) {
      router.push('/tasks');
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <Background />

      <div className="relative z-10 w-full max-w-lg slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-mono tracking-[0.4em] text-cyan-400 uppercase mb-3">/РЕГИСТРАЦИЯ/</p>
          <h1 className="text-3xl font-black neon-text mb-2">
            {step === 1 ? 'КОМАНДА' : 'УЧАСТНИКИ'}
          </h1>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-cyan-300' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border
                ${step === 1 ? 'border-cyan-400 bg-cyan-500/20' : 'border-cyan-600 bg-cyan-600/30'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <span className="text-xs">Команда</span>
            </div>
            <div className="w-8 h-px bg-cyan-500/30" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-cyan-300' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border
                ${step === 2 ? 'border-cyan-400 bg-cyan-500/20' : 'border-gray-700 bg-gray-800/30'}`}>
                2
              </div>
              <span className="text-xs">Участники</span>
            </div>
          </div>
        </div>

        <div className="card-glow neon-border rounded-2xl p-8">
          {/* Step 1: Team */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-widest mb-2">
                  Название команды
                </label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Phoenix Squad..."
                  className="input-neon w-full px-4 py-3 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-widest mb-2">
                  Пароль команды
                </label>
                <input
                  type="password"
                  value={teamForm.password}
                  onChange={e => setTeamForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Минимум 6 символов"
                  className="input-neon w-full px-4 py-3 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 uppercase tracking-widest mb-2">
                  Повторите пароль
                </label>
                <input
                  type="password"
                  value={teamForm.confirmPassword}
                  onChange={e => setTeamForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="input-neon w-full px-4 py-3 rounded-lg text-sm"
                />
              </div>

              {/* Admin option */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={teamForm.isAdmin}
                    onChange={e => setTeamForm(f => ({ ...f, isAdmin: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center
                    ${teamForm.isAdmin
                      ? 'border-yellow-500 bg-yellow-500/20 shadow-[0_0_8px_rgba(234,179,8,0.4)]'
                      : 'border-gray-600 bg-transparent group-hover:border-cyan-600'
                    }`}>
                    {teamForm.isAdmin && <span className="text-yellow-400 text-xs">✓</span>}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-100">Регистрация как администратор</p>
                  <p className="text-xs text-slate-400 mt-0.5">Доступ к управлению участниками и рейтингом</p>
                </div>
              </label>

              {error && (
                <div className="px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-400 font-mono">
                  ⚠ {error}
                </div>
              )}

              <button type="submit" className="btn-solid w-full py-3 rounded-lg text-sm font-semibold tracking-wide uppercase">
                Далее →
              </button>
            </form>
          )}

          {/* Step 2: Participants */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-xs font-mono text-slate-300 text-center">
                Команда: <span className="text-cyan-300">{teamForm.name}</span> · {participants.length} участник(а)
              </p>

              {participants.map((p, i) => (
                <div key={i} className="rounded-xl border border-cyan-500/15 p-4 space-y-3"
                  style={{ background: 'rgba(34, 211, 238, 0.03)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest">
                      Участник {i + 1}
                    </span>
                    {participants.length > 1 && (
                      <button type="button" onClick={() => removeParticipant(i)}
                        className="text-xs text-slate-400 hover:text-red-400 transition-colors">
                        × Удалить
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={p.fullName}
                    onChange={e => updateParticipant(i, 'fullName', e.target.value)}
                    placeholder="Фамилия Имя Отчество"
                    className="input-neon w-full px-3 py-2.5 rounded-lg text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={p.city}
                      onChange={e => updateParticipant(i, 'city', e.target.value)}
                      placeholder="Город"
                      className="input-neon w-full px-3 py-2.5 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={p.school}
                      onChange={e => updateParticipant(i, 'school', e.target.value)}
                      placeholder="Школа / Лицей"
                      className="input-neon w-full px-3 py-2.5 rounded-lg text-sm"
                    />
                  </div>
                </div>
              ))}

              {participants.length < 5 && (
                <button
                  type="button"
                  onClick={addParticipant}
                  className="w-full py-2.5 rounded-lg border border-dashed border-cyan-500/30 text-sm text-cyan-400/70 hover:text-cyan-300 hover:border-cyan-500/50 transition-all duration-200"
                >
                  + Добавить участника ({participants.length}/5)
                </button>
              )}

              {error && (
                <div className="px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-400 font-mono">
                  ⚠ {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="btn-neon px-5 py-3 rounded-lg text-sm font-semibold"
                >
                  ← Назад
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-solid flex-1 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Регистрация...
                    </span>
                  ) : 'Завершить регистрацию'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-cyan-500/10 text-center">
            <p className="text-sm text-slate-300">
              Уже есть команда?{' '}
              <Link href="/login" className="text-cyan-300 hover:text-cyan-200 transition-colors">
                Войти
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            ← Вернуться на главную
          </Link>
        </p>
      </div>
    </div>
  );
}

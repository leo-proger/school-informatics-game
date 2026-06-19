'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import Background from '@/app/components/layout/Background';

export default function LoginPage() {
  const { login, team, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && team) {
      router.replace('/tasks');
    }
  }, [team, isLoading, router]);
  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return { name: localStorage.getItem('phoenix_login_draft') ?? '', password: '' }; } catch {}
    }
    return { name: '', password: '' };
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.password) {
      setError('Заполните все поля');
      return;
    }
    setLoading(true);
    const result = await login(form.name.trim(), form.password);
    setLoading(false);
    if (result.success) {
      try { localStorage.removeItem('phoenix_login_draft'); } catch {}
      router.push('/tasks');
    } else {
      setError(result.error || 'Ошибка входа');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <Background />

      <div className="relative z-10 w-full max-w-md slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-mono tracking-[0.4em] text-cyan-400 uppercase mb-3">/ПРОТОКОЛ/</p>
          <h1 className="text-3xl font-black neon-text mb-2">ВХОД В СИСТЕМУ</h1>
          <p className="text-sm text-slate-300">Введите данные вашей команды</p>
        </div>

        {/* Card */}
        <div className="card-glow neon-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-cyan-300 uppercase tracking-widest mb-2">
                Название команды
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => {
                  const name = e.target.value;
                  setForm(f => ({ ...f, name }));
                  try { localStorage.setItem('phoenix_login_draft', name); } catch {}
                }}
                placeholder="Введите название..."
                className="input-neon w-full px-4 py-3 rounded-lg text-sm"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 uppercase tracking-widest mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="input-neon w-full px-4 py-3 rounded-lg text-sm"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-400 font-mono">
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-solid w-full py-3 rounded-lg text-sm font-semibold tracking-wide uppercase disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Авторизация...
                </span>
              ) : 'Войти'}
            </button>
          </form>

          {/* Forgot password */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowForgot(!showForgot)}
              className="text-xs text-slate-300 hover:text-cyan-300 transition-colors"
            >
              Забыли пароль?
            </button>
          </div>

          {showForgot && (
            <div className="mt-4 p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-xs font-mono text-cyan-300">
              <p className="mb-1 text-cyan-400">{"// ВОССТАНОВЛЕНИЕ ДОСТУПА"}</p>
              <p className="text-slate-200">Обратитесь к организаторам олимпиады по email:</p>
              <p className="text-cyan-300 mt-1">phoenix.corps@nexus-2031.ru</p>
            </div>
          )}

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-cyan-500/10 text-center">
            <p className="text-sm text-slate-300">
              Нет команды?{' '}
              <Link href="/register" className="text-cyan-300 hover:text-cyan-200 transition-colors">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <p className="text-center mt-6">
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
            ← Вернуться на главную
          </Link>
        </p>
      </div>
    </div>
  );
}

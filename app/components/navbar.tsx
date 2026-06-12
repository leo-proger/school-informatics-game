'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/lib/auth-context';

export default function Navbar() {
  const { team, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const links = [
    { href: '/', label: 'Главная' },
    { href: '/tasks', label: 'Задания' },
    { href: '/leaderboard', label: 'Рейтинг' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-purple-500/20 backdrop-blur-md"
      style={{ background: 'rgba(6, 6, 15, 0.85)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded border border-purple-500/50 flex items-center justify-center
            group-hover:border-purple-400 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-300">
            <span className="text-purple-300 font-bold text-sm">Ф</span>
          </div>
          <span className="font-bold text-sm tracking-widest text-purple-300 uppercase
            group-hover:text-purple-200 transition-colors hidden sm:block">
            Protocol<span className="text-blue-300 ml-1">Phoenix</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded text-sm font-medium tracking-wide transition-all duration-200
                ${pathname === link.href
                  ? 'text-purple-300 bg-purple-500/10 border border-purple-500/30'
                  : 'text-slate-200 hover:text-purple-300 hover:bg-purple-500/8'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div className="w-24 h-8 rounded bg-purple-500/10 animate-pulse" />
          ) : team ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                <span className="text-sm text-slate-100">
                  {team.isAdmin && <span className="text-yellow-400 mr-1">[ADMIN]</span>}
                  {team.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded text-xs text-slate-300 border border-gray-700 hover:border-red-500/50 hover:text-red-400 transition-all duration-200"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/login"
                className="px-4 py-1.5 rounded text-sm text-purple-300 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-200">
                Войти
              </Link>
              <Link href="/register"
                className="px-4 py-1.5 rounded text-sm text-white btn-solid">
                Регистрация
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-purple-300 transition-colors"
        >
          <div className="w-5 h-0.5 bg-current mb-1 transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translate(0px, 6px)' : 'none' }} />
          <div className="w-5 h-0.5 bg-current mb-1 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <div className="w-5 h-0.5 bg-current transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translate(0px, -6px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-purple-500/20 px-4 py-4 space-y-2"
          style={{ background: 'rgba(6, 6, 15, 0.95)' }}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded text-sm transition-colors
                ${pathname === link.href ? 'text-purple-300 bg-purple-500/10' : 'text-slate-300 hover:text-purple-300'}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-purple-500/10 flex flex-col gap-2">
            {team ? (
              <>
                <span className="text-sm text-slate-300 px-3">{team.name}</span>
                <button onClick={handleLogout} className="text-left px-3 py-2 text-sm text-red-400">Выйти</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-purple-300">Войти</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded">Регистрация</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

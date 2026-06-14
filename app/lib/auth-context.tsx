'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Participant {
  id: string;
  fullName: string;
  city: string;
  school: string;
}

export interface Team {
  id: string;
  name: string;
  password: string;
  participants: Participant[];
  isAdmin: boolean;
  score: number;
  tour1Completed: boolean;
  tour2Completed: boolean;
  registeredAt: string;
}

interface AuthState {
  team: Team | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (name: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (teamData: { name: string; password: string; isAdmin: boolean }, participants: Omit<Participant, 'id'>[]) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'phoenix_teams';
const SESSION_KEY = 'phoenix_session';

function getTeams(): Team[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveTeams(teams: Team[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ team: null, isLoading: true });

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      const teams = getTeams();
      const team = teams.find(t => t.id === sessionId) || null;
      setState({ team, isLoading: false });
    } else {
      setState({ team: null, isLoading: false });
    }
  }, []);

  const login = (name: string, password: string): { success: boolean; error?: string } => {
    const teams = getTeams();
    const team = teams.find(t => t.name.toLowerCase() === name.toLowerCase() && t.password === password);
    if (!team) return { success: false, error: 'Неверное название команды или пароль' };
    localStorage.setItem(SESSION_KEY, team.id);
    setState({ team, isLoading: false });
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setState({ team: null, isLoading: false });
  };

  const register = (
    teamData: { name: string; password: string; isAdmin: boolean },
    participants: Omit<Participant, 'id'>[]
  ): { success: boolean; error?: string } => {
    const teams = getTeams();
    if (teams.find(t => t.name.toLowerCase() === teamData.name.toLowerCase())) {
      return { success: false, error: 'Команда с таким именем уже существует' };
    }
    const newTeam: Team = {
      id: Math.random().toString(36).slice(2),
      name: teamData.name,
      password: teamData.password,
      isAdmin: teamData.isAdmin,
      participants: participants.map(p => ({ ...p, id: Math.random().toString(36).slice(2) })),
      score: 0,
      tour1Completed: false,
      tour2Completed: false,
      registeredAt: new Date().toISOString(),
    };
    saveTeams([...teams, newTeam]);
    localStorage.setItem(SESSION_KEY, newTeam.id);
    setState({ team: newTeam, isLoading: false });
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

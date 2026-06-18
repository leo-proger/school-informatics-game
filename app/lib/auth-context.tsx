'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';

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
  login: (name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (teamData: { name: string; password: string; isAdmin: boolean }, participants: Omit<Participant, 'id'>[]) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'phoenix_session';

function rowToTeam(row: Record<string, unknown>, participants: Participant[]): Team {
  return {
    id: row.id as string,
    name: row.name as string,
    password: row.password as string,
    isAdmin: row.is_admin as boolean,
    score: row.score as number,
    tour1Completed: row.tour1_completed as boolean,
    tour2Completed: row.tour2_completed as boolean,
    registeredAt: row.registered_at as string,
    participants,
  };
}

async function fetchTeamById(id: string): Promise<Team | null> {
  const { data: teamRow, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !teamRow) return null;

  const { data: participantRows } = await supabase
    .from('participants')
    .select('*')
    .eq('team_id', id);

  const participants: Participant[] = (participantRows ?? []).map(p => ({
    id: p.id,
    fullName: p.full_name,
    city: p.city,
    school: p.school,
  }));

  return rowToTeam(teamRow, participants);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ team: null, isLoading: true });

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ team: null, isLoading: false });
      return;
    }
    fetchTeamById(sessionId).then(team => {
      setState({ team, isLoading: false });
    });
  }, []);

  const login = async (name: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data: teamRow, error } = await supabase
      .from('teams')
      .select('*')
      .ilike('name', name)
      .eq('password', password)
      .single();

    if (error || !teamRow) return { success: false, error: 'Неверное название команды или пароль' };

    const { data: participantRows } = await supabase
      .from('participants')
      .select('*')
      .eq('team_id', teamRow.id);

    const participants: Participant[] = (participantRows ?? []).map(p => ({
      id: p.id,
      fullName: p.full_name,
      city: p.city,
      school: p.school,
    }));

    const team = rowToTeam(teamRow, participants);
    localStorage.setItem(SESSION_KEY, team.id);
    setState({ team, isLoading: false });
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('phoenix_round1_progress');
    localStorage.removeItem('phoenix_round2_progress');
    localStorage.removeItem('collectedLetters');
    localStorage.removeItem('round1Completed');
    setState({ team: null, isLoading: false });
  };

  const register = async (
    teamData: { name: string; password: string; isAdmin: boolean },
    participants: Omit<Participant, 'id'>[]
  ): Promise<{ success: boolean; error?: string }> => {
    const { data: existing } = await supabase
      .from('teams')
      .select('id')
      .ilike('name', teamData.name)
      .single();

    if (existing) return { success: false, error: 'Команда с таким именем уже существует' };

    const { data: teamRow, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: teamData.name,
        password: teamData.password,
        is_admin: teamData.isAdmin,
      })
      .select()
      .single();

    if (teamError || !teamRow) return { success: false, error: 'Ошибка при создании команды' };

    const { error: participantsError } = await supabase
      .from('participants')
      .insert(participants.map(p => ({
        team_id: teamRow.id,
        full_name: p.fullName,
        city: p.city,
        school: p.school,
      })));

    if (participantsError) {
      await supabase.from('teams').delete().eq('id', teamRow.id);
      return { success: false, error: 'Ошибка при добавлении участников' };
    }

    const { data: insertedParticipants } = await supabase
      .from('participants')
      .select('*')
      .eq('team_id', teamRow.id);

    const realParticipants: Participant[] = (insertedParticipants ?? []).map(p => ({
      id: p.id,
      fullName: p.full_name,
      city: p.city,
      school: p.school,
    }));

    const team = rowToTeam(teamRow, realParticipants);
    localStorage.setItem(SESSION_KEY, team.id);
    setState({ team, isLoading: false });
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

import { supabase } from './supabase';

export const SESSION_KEY = 'phoenix_session';

export async function addScore(points: number) {
  const teamId = localStorage.getItem(SESSION_KEY);
  if (!teamId) return;
  const { data } = await supabase.from('teams').select('score').eq('id', teamId).single();
  if (data) {
    await supabase.from('teams').update({ score: (data.score ?? 0) + points }).eq('id', teamId);
  }
}

export async function saveProgressToDB(column: string, progress: object) {
  const teamId = localStorage.getItem(SESSION_KEY);
  if (!teamId) return;
  await supabase.from('teams').update({ [column]: progress }).eq('id', teamId);
}

-- Начальная схема для NEXUS Олимпиада — Протокол ФЕНИКС

create table if not exists teams (
  id              uuid primary key default gen_random_uuid(),
  name            text not null unique,
  password        text not null,
  is_admin        boolean not null default false,
  score           integer not null default 0,
  tour1_completed boolean not null default false,
  tour2_completed boolean not null default false,
  round1_progress jsonb,
  round2_progress jsonb,
  registered_at   timestamptz not null default now()
);

create table if not exists participants (
  id        uuid primary key default gen_random_uuid(),
  team_id   uuid not null references teams(id) on delete cascade,
  full_name text not null,
  city      text not null default '',
  school    text not null default ''
);

create table if not exists tasks (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null default '',
  answer       text not null,
  hint         text not null default '',
  difficulty   text not null default 'easy',
  time_limit   integer not null default 300,
  task_number  integer not null,
  tour         integer not null default 1,
  task_type    text not null default 'regular',
  min_team_size integer not null default 1
);

create table if not exists settings (
  key   text primary key,
  value text not null,
  label text not null default ''
);

-- RLS включён, но для локальной разработки политики открыты
alter table teams       enable row level security;
alter table participants enable row level security;
alter table tasks        enable row level security;
alter table settings     enable row level security;

create policy "anon full access teams"       on teams       for all to anon using (true) with check (true);
create policy "anon full access participants" on participants for all to anon using (true) with check (true);
create policy "anon full access tasks"       on tasks       for all to anon using (true) with check (true);
create policy "anon full access settings"    on settings    for all to anon using (true) with check (true);

-- Явные GRANT-ы для Data API (anon-роль)
grant usage on schema public to anon, authenticated;
grant all on teams, participants, tasks, settings to anon, authenticated;

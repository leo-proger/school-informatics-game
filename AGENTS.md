<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: NEXUS Hackathon — Протокол ФЕНИКС

Платформа хакатона (6–20 июня 2026). Киберпанк RPG-интерфейс с Supabase-бэкендом.

## Стек
- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Бэкенд: Supabase (`app/lib/supabase.ts`) — таблицы `teams`, `participants`, `tasks`, `settings`
- Переменные окружения: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (см. `.env.example`)
- Сессия игрока: `localStorage` ключ `phoenix_session` (хранит только team id)
- Прогресс игры: `localStorage` ключ `phoenix_round1_progress` (SAVE_KEY в `app/tasks/round1/page.tsx`)

## Ключевые файлы

### Логика и данные
- `app/lib/auth-context.tsx` — авторизация через Supabase: `register`, `login`, `logout`, типы `Team` и `Participant`
- `app/lib/supabase.ts` — клиент Supabase
- `app/lib/types.ts` — общие типы: `GameTask`, `TaskNode`, `DialogueLine`
- `app/lib/characters.ts` — 4 персонажа: `protocol`, `nexus`, `void`, `player` (тип `CharacterId`)
- `app/lib/mock-data.ts` — моковый лидерборд (`MOCK_LEADERBOARD`) и `TOURNAMENT_DATES` (для страницы лидерборда)
- `app/data/tasks-round1.ts` — задания тура 1; экспортирует `round1Tasks`, `getTask()`, `checkAnswer()`
- `app/data/tasks-round2.ts` — босс-задание тура 2; экспортирует `getBossTask()`, `checkBossAnswer()`
- `app/data/dialogues.ts` — диалоговые последовательности: `prologue`, `round1Complete`, `round2Start`, `round2Complete`, `taskDialogs`

### Компоненты
- `app/components/navbar.tsx` — навбар с состоянием авторизации
- `app/components/dialogue/` — `DialogueBox`, `CharacterPlate`, `TypeWriter`
- `app/components/layout/` — `Background`, `GameLayout`, `TopHUD`
- `app/components/tasks/` — `TaskMap`, `TaskCard`, `PuzzleModal`
- `app/components/ui/` — `GlassPanel`, `NeonButton`, `ProgressBar`

## Страницы
- `/` — лендинг с лором
- `/register` — 2 шага: данные команды → участники (1–5 чел.)
- `/login` — вход по названию + паролю
- `/tasks` — выбор тура; тур 2 заблокирован; показывает состояние сохранения
- `/tasks/round1` — основная игра: пролог → карта заданий → PuzzleModal → диалоги → босс → победа
- `/leaderboard` — рейтинг (моковые данные)
- `/admin` — панель администратора (только для `isAdmin`): вкладки «Команды», «Задания», «Настройки»

## Игровые фазы (`/tasks/round1`)
`video` → `prologue` → `round1` → `taskDialogue` → `round1Complete` → `round2Code` → `round2Dialogue` → `round2Boss` → `victory`

Прогресс сохраняется в localStorage при каждом переходе фазы. Поля сохранения: `phase`, `prologueIndex`, `completedTasks`, `activeTaskId`, `collectedLetters`, `pendingTaskId`, `taskDialogIndex`, `round2DialogueIndex`, `r1cIdx`, `victoryIndex`.

## Бизнес-логика
- Задания тура 1: `difficulty: "easy" | "medium" | "hard" | "boss"`, `task_type: "regular" | "boss"`
- Тур 2: одно босс-задание, выбирается по `getBossTask(minTeamSize)` из `tasks-round2.ts`
- Ответы проверяются реально через `checkAnswer()` / `checkBossAnswer()`
- Даты туров управляются через таблицу `settings` в Supabase (редактируется в `/admin`)
- Флаг `isAdmin` у команды — доступ к `/admin`; при не-админ сессии редирект на `/`

## Supabase-таблицы
- `teams` — id, name, password, is_admin, score, tour1_completed, tour2_completed, registered_at
- `participants` — id, team_id, full_name, city, school
- `tasks` — id, title, description, answer, hint, difficulty, time_limit, task_number, tour, task_type, min_team_size
- `settings` — key, value, label (даты турниров)

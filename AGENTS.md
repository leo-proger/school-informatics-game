<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: NEXUS Олимпиада — Протокол ФЕНИКС

Платформа олимпиады (6–20 июня 2026). Киберпанк RPG-интерфейс с Supabase-бэкендом.

## Git-workflow
- Каждый разработчик работает **в своей ветке** (например `egor`, `dev`)
- **Не пушить напрямую в `main`** — только через merge request
- Для мержа в `main` пишите @leo-proger на GitHub

## Стек
- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Бэкенд: Supabase (`app/lib/supabase.ts`) — таблицы `teams`, `participants`, `tasks`, `settings`
- Переменные окружения: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (см. `.env.example`)
- Сессия игрока: `localStorage` ключ `phoenix_session` (хранит только team id)
- Прогресс игры: `localStorage` ключ `phoenix_round1_progress` (SAVE_KEY в `app/tasks/round1/page.tsx`), `phoenix_round2_progress` (SAVE_KEY в `app/tasks/round2/page.tsx`)
- Деплой: Vercel, только при пуше в `main` (`vercel.json` → `ignoreCommand`)

## Ключевые файлы

### Логика и данные
- `app/lib/auth-context.tsx` — авторизация через Supabase: `register`, `login`, `logout`, типы `Team` и `Participant`
- `app/lib/supabase.ts` — клиент Supabase
- `app/lib/game-actions.ts` — общие Supabase-операции записи: `SESSION_KEY`, `addScore(points)`, `saveProgressToDB(column, progress)`; используется в обоих турах
- `app/lib/types.ts` — общие типы: `GameTask`, `TaskNode`, `DialogueLine`
- `app/lib/characters.ts` — 4 персонажа: `protocol`, `nexus`, `void`, `player` (тип `CharacterId`)
- `app/lib/game-utils.ts` — утилиты: `DIFFICULTY_POINTS`, построение `TaskNode`-графа
- `app/lib/settings-utils.ts` — утилиты для работы с таблицей `settings` Supabase
- `app/lib/mock-data.ts` — моковый лидерборд (`MOCK_LEADERBOARD`) и `TOURNAMENT_DATES`
- `app/data/tasks-round1.ts` — задания тура 1; экспортирует `round1Tasks`, `getTask()`, `checkAnswer()`
- `app/data/tasks-round2.ts` — задания тура 2; экспортирует `round2Tasks`, `checkBossAnswer()`
- `app/data/dialogues.ts` — диалоги тура 1: `prologue`, `round1Complete`, `taskDialogs`
- `app/data/dialogues-round2.ts` — диалоги тура 2: `round2Start`, `round2Complete`, `voidHologramDialogues`

### Компоненты
- `app/components/navbar.tsx` — навбар с состоянием авторизации
- `app/components/dialogue/` — `DialogueBox`, `CharacterPlate`, `TypeWriter`
- `app/components/layout/` — `Background`, `GameLayout`, `TaskBackground`, `TopHUD`
- `app/components/tasks/` — `TaskMap`, `TaskCard`, `PuzzleModal`
- `app/components/ui/` — `GlassPanel`, `NeonButton`, `ProgressBar`, `VideoPlayer`, `LoadingSpinner`

`VideoPlayer` — видео с кнопкой «Пропустить»; принимает `src`, `onEnded`, `onSkip`. Используется в тур-1 (видео-заставка, аутро) и тур-2 (интро, аутро).
`LoadingSpinner` — стандартный индикатор загрузки на весь экран; используется во всех игровых страницах.

## Страницы
- `/` — лендинг с лором
- `/register` — 2 шага: данные команды → участники (1–5 чел.)
- `/login` — вход по названию + паролю
- `/tasks` — выбор тура; тур 2 заблокирован; показывает состояние сохранения
- `/tasks/round1` — основная игра: пролог → карта заданий → PuzzleModal → диалоги → босс → победа
- `/tasks/round2` — тур 2: диалоги → карта босс-заданий → голограмма VOID → победа
- `/leaderboard` — рейтинг (моковые данные)
- `/schedule` — расписание турнира
- `/admin` — панель администратора (только для `isAdmin`): вкладки «Команды», «Задания», «Настройки»

## Игровые фазы

### Тур 1 (`/tasks/round1`)
`video` → `prologue` → `round1` → `taskDialogue` → `round1Complete` → `round1Code` → `round1Outro`

Поля сохранения: `phase`, `prologueIndex`, `completedTasks`, `activeTaskId`, `collectedLetters`, `pendingTaskId`, `taskDialogIndex`, `r1cIdx`, `failedTasks`, `accessCode`.

### Тур 2 (`/tasks/round2`)
`intro` → `dialogue` → `boss` → `victory` → `outro`

Голограмма VOID появляется после 3 выполненных заданий. Поля сохранения: `phase`, `dialogueIndex`, `victoryIndex`, `completedTasks`, `failedTasks`, `activeTaskIndex`, `showVoidHologram`, `showHologramDialogue`, `hologramIndex`.

## Бизнес-логика
- Задания тура 1: `difficulty: "easy" | "medium" | "hard" | "boss"`, `task_type: "regular" | "boss"`
- Тур 2: 5 босс-заданий (`round2Tasks`), очки за каждое — 500 (`ROUND2_TASK_POINTS`)
- Ответы проверяются реально через `checkAnswer()` / `checkBossAnswer()`
- Очки и флаги `tour1_completed` / `tour2_completed` записываются в Supabase при завершении
- Даты туров управляются через таблицу `settings` в Supabase (редактируется в `/admin`)
- Флаг `isAdmin` у команды — доступ к `/admin`; при не-админ сессии редирект на `/`

## Supabase-таблицы
- `teams` — id, name, password, is_admin, score, tour1_completed, tour2_completed, registered_at
- `participants` — id, team_id, full_name, city, school
- `tasks` — id, title, description, answer, hint, difficulty, time_limit, task_number, tour, task_type, min_team_size
- `settings` — key, value, label (даты турниров)

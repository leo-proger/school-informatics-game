# NEXUS Hackathon — Протокол ФЕНИКС

Платформа для проведения хакатона в киберпанк RPG-сеттинге (6–20 июня 2026). Команды регистрируются, проходят пролог,
решают задания двух туров и соревнуются в рейтинге.

## Стек

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** — стилизация
- **Supabase** — база данных и авторизация (таблицы: `teams`, `participants`, `tasks`, `settings`)
- **localStorage** — сессия игрока (`phoenix_session`) и прогресс игры (`phoenix_round1_progress`)

## Структура проекта

```
app/
├── page.tsx                  # Лендинг с лором и кнопками входа/регистрации
├── register/                 # Регистрация команды (2 шага)
├── login/                    # Вход по названию + паролю
├── tasks/
│   ├── page.tsx              # Выбор тура, статус сохранений
│   └── round1/               # Основная игра (пролог → карта → босс → победа)
├── leaderboard/              # Рейтинг (моковые данные)
├── admin/                    # Панель администратора (только для isAdmin)
├── components/
│   ├── navbar.tsx
│   ├── dialogue/             # DialogueBox, CharacterPlate, TypeWriter
│   ├── layout/               # Background, GameLayout, TopHUD
│   ├── tasks/                # TaskMap, TaskCard, PuzzleModal
│   └── ui/                   # GlassPanel, NeonButton, ProgressBar
├── data/
│   ├── tasks-round1.ts       # Задания тура 1
│   ├── tasks-round2.ts       # Босс-задание тура 2
│   └── dialogues.ts          # Все диалоговые последовательности
└── lib/
    ├── auth-context.tsx      # Контекст авторизации через Supabase
    ├── supabase.ts           # Клиент Supabase
    ├── types.ts              # Общие типы (GameTask, TaskNode, DialogueLine)
    ├── characters.ts         # 4 персонажа: protocol, nexus, void, player
    └── mock-data.ts          # Моковый лидерборд, TOURNAMENT_DATES
```

## Настройка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Получить доступ к Supabase

БД уже поднята и наполнена. Попросите владельца проекта добавить вас в организацию через **Supabase Dashboard →
Organization Settings → Members → Invite**.

После принятия приглашения откройте проект и скопируйте **Project Settings → API → вкладка "Legacy anon..." → "anon
public" ключ** - это `NEXT_PUBLIC_SUPABASE_ANON_KEY` в `.env.local`

### 3. Переменные окружения

```bash
cp .env.example .env.local
```

Вставьте ключи из предыдущего шага (переменную `NEXT_PUBLIC_SUPABASE_URL` менять не надо):

```env
NEXT_PUBLIC_SUPABASE_URL=https://yanxxepahepxskhlbxif.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

## Игровые фазы (`/tasks/round1`)

```
video → prologue → round1 → taskDialogue → round1Complete → round2Code → round2Dialogue → round2Boss → victory
```

Прогресс сохраняется в `localStorage` при каждом переходе фазы.

## Механика

**Регистрация** — название команды (мин. 3 симв.) + пароль (мин. 6 симв.) + данные участников (1–5 чел.: ФИО, город,
школа).

**Тур 1** — 4 задания разной сложности (`easy`, `medium`, `hard`) + финальный диалог. Ответы проверяются через
`checkAnswer()`.

**Тур 2** — одно босс-задание, выбираемое по размеру команды (`getBossTask(minTeamSize)`). Проверка через
`checkBossAnswer()`.

**Рейтинг** — моковые данные (`MOCK_LEADERBOARD`). Фильтрация по городу и школе.

**Даты туров** — управляются через таблицу `settings` в Supabase, редактируются в `/admin`.

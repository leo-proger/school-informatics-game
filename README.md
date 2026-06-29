<div align="center">

# NEXUS Олимпиада — Протокол «ФЕНИКС»

**Веб-платформа для проведения онлайн-олимпиады в киберпанк RPG-сеттинге.**

Участники объединяются в команды, проходят сюжетные диалоги и решают задания
двух туров, зарабатывая очки и поднимаясь в рейтинге.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

</div>

---

## О проекте

«Протокол ФЕНИКС» — это игровая оболочка для образовательной олимпиады по
информатике и кибербезопасности. Вместо привычного списка задач участник
попадает в историю: международная цифровая инфраструктура заражена вирусом,
алгоритмы дают сбой, шифры ломаются — и команде предстоит «взломать протокол»,
проходя задания тур за туром.

Платформа закрывает весь цикл проведения олимпиады:

- регистрация команд и участников;
- прохождение заданий с проверкой ответов в реальном времени;
- сюжетные диалоги, видеозаставки и боссы между этапами;
- рейтинг команд;
- админ-панель для управления командами, заданиями и датами турнира.

> Проект сделан как готовый каркас: визуальный стиль, игровые механики и
> структуру заданий легко адаптировать под собственное мероприятие.

## Скриншоты

| Главный экран | Правила игры |
|:---:|:---:|
| ![Главный экран](https://github.com/user-attachments/assets/5436cae3-c974-47ed-80a9-ca16b09ecb93) | ![Правила игры](https://github.com/user-attachments/assets/55d2c901-6393-4c60-9298-5abb7f7620a7) |

| Задания | Рейтинг |
|:---:|:---:|
| ![Задания](https://github.com/user-attachments/assets/4a67f6bc-238c-4218-bfc1-d2d37b66cfca) | ![Рейтинг](https://github.com/user-attachments/assets/ed59b619-75ae-4200-8375-0ac346ffe2cf) |

## Возможности

- **Сюжетный режим** — пролог, диалоги персонажей (`protocol`, `nexus`, `void`,
  `player`), видеозаставки и финальные боссы между этапами.
- **Два тура с разной механикой** — тур 1 (задания разной сложности на карте) и
  тур 2 (5 босс-заданий + голограмма VOID после трёх решённых).
- **Реальная проверка ответов** — задания проверяются на сервере, а не «на
  доверии»; за сложность начисляются разные очки.
- **Сохранение прогресса** — каждая фаза игры сохраняется в `localStorage`,
  можно вернуться с того же места.
- **Рейтинг** — таблица лидеров с фильтрами по городу и школе.
- **Админ-панель** (`/admin`) — вкладки «Команды», «Задания», «Настройки»
  (в т.ч. даты туров); доступна только командам с флагом `is_admin`.
- **Адаптивность** — интерфейс рассчитан и на десктоп, и на мобильные экраны.

## Технологии

| Слой | Технологии |
|------|-----------|
| Фронтенд | Next.js 16 (App Router), React 19, TypeScript |
| Стили | Tailwind CSS 4 |
| Бэкенд / БД | Supabase (PostgreSQL): таблицы `teams`, `participants`, `tasks`, `settings` |
| Состояние игрока | `localStorage` (сессия и прогресс туров) |
| Тесты | Vitest + Testing Library |
| Деплой | Vercel |

## Быстрый старт

### 1. Клонирование и установка

```bash
git clone git@github.com:leo-proger/school-informatics-game.git
cd school-informatics-game
npm install
```

### 2. Вариант А — локальный Supabase (рекомендуется для разработки)

Требуется [Docker](https://www.docker.com/) и [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
# Установить CLI (macOS)
brew install supabase/tap/supabase

# Поднять локальный Supabase (первый раз скачивает образы ~500 МБ)
supabase start

# Переключить .env.local на локальный экземпляр
cp .env.local.example-local .env.local

# Заполнить БД тестовыми данными
npm run db:reset
```

После `supabase start` CLI выведет URL и ключи. Стандартные значения для
локального запуска уже прописаны в `.env.local.example-local`.

**Studio (GUI для БД)** доступна на [http://127.0.0.1:54323](http://127.0.0.1:54323).

### 2. Вариант Б — облачный Supabase

Создайте бесплатный проект на [supabase.com](https://supabase.com/).
Схема БД применится автоматически через файлы в `supabase/migrations/`.

```bash
cp .env.example .env.local
```

Заполните `.env.local` значениями из **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### Команды

```bash
npm run dev              # режим разработки
npm run build            # production-сборка
npm run start            # запуск собранного приложения
npm run lint             # проверка ESLint
npm run test             # запуск тестов (Vitest)
npm run db:reset         # сбросить и заполнить локальную БД тестовыми данными
npm run db:reset:remote  # то же для удалённой БД (требует подтверждения)
```

### Тестовые аккаунты (после `db:reset`)

| Логин | Пароль | Роль |
|-------|--------|------|
| `admin` | `admin123` | Администратор (доступ к `/admin`) |
| `Nexus Breakers` | `pass1` | Оба тура завершены, 920 очков |
| `Cyber Wolves` | `pass4` | Тур 1 завершён, 780 очков |
| `Ghost Protocol` | `pass5` | Новая команда, 0 очков |

## Структура проекта

```
app/
├── page.tsx                  # Лендинг с лором и кнопками входа/регистрации
├── register/                 # Регистрация команды (2 шага)
├── login/                    # Вход по названию + паролю
├── schedule/                 # Расписание турнира
├── tasks/
│   ├── page.tsx              # Выбор тура, статус сохранений
│   ├── round1/               # Тур 1: пролог → карта → диалоги → босс → победа
│   └── round2/               # Тур 2: диалоги → карта босс-заданий → VOID → победа
├── leaderboard/              # Рейтинг
├── admin/                    # Панель администратора (только для is_admin)
├── components/
│   ├── dialogue/             # DialogueBox, CharacterPlate, TypeWriter
│   ├── layout/               # Background, GameLayout, TaskBackground, TopHUD
│   ├── tasks/                # TaskMap, TaskCard, PuzzleModal
│   └── ui/                   # GlassPanel, NeonButton, ProgressBar, VideoPlayer
├── data/
│   ├── tasks-round1.ts       # Задания тура 1
│   ├── tasks-round2.ts       # Босс-задания тура 2
│   ├── dialogues.ts          # Диалоги тура 1
│   └── dialogues-round2.ts   # Диалоги тура 2
└── lib/
    ├── auth-context.tsx      # Авторизация через Supabase
    ├── supabase.ts           # Клиент Supabase
    ├── game-actions.ts       # Запись очков и прогресса в БД
    ├── types.ts              # Общие типы (GameTask, TaskNode, DialogueLine)
    ├── characters.ts         # Персонажи: protocol, nexus, void, player
    └── game-utils.ts         # Очки за сложность, построение графа заданий
```

## Игровой процесс

### Тур 1 (`/tasks/round1`)

```
видео → пролог → задания → диалог → завершение → код доступа → аутро
```

4 задания разной сложности (`easy`, `medium`, `hard`) на карте, финальный диалог
и переход к следующему туру. Ответы проверяются через `checkAnswer()`.

### Тур 2 (`/tasks/round2`)

```
интро → диалоги → босс → победа → аутро
```

5 босс-заданий (по 500 очков за каждое), проверка через `checkBossAnswer()`.
После трёх решённых появляется голограмма VOID. Очки и флаг `tour2_completed`
записываются в Supabase.

Прогресс каждой фазы сохраняется в `localStorage`, поэтому игру можно продолжить
с того же места.

## База данных

Минимальная схема таблиц Supabase:

| Таблица | Ключевые поля |
|---------|---------------|
| `teams` | `id`, `name`, `password`, `is_admin`, `score`, `tour1_completed`, `tour2_completed`, `registered_at` |
| `participants` | `id`, `team_id`, `full_name`, `city`, `school` |
| `tasks` | `id`, `title`, `description`, `answer`, `hint`, `difficulty`, `time_limit`, `task_number`, `tour`, `task_type`, `min_team_size` |
| `settings` | `key`, `value`, `label` (даты и параметры турнира) |

Даты туров редактируются в админ-панели и хранятся в таблице `settings`.

## Деплой

Проект разворачивается на [Vercel](https://vercel.com/). Деплой настроен только
на пуш в ветку `main` (см. `vercel.json`). Не забудьте задать переменные
окружения `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` в
настройках проекта Vercel.

## Контрибьюторы

- [Leo Proger](https://github.com/leo-proger)
- [Fllorovi](https://github.com/Fllorovi)
- [thwkxri](https://github.com/thwkxri)

Также ещё 4 участника без GitHub профиля.

## Лицензия

Распространяется под лицензией **Apache 2.0** — см. файл [LICENSE](LICENSE).

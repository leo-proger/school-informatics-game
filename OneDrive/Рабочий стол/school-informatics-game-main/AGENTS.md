<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: NEXUS Hackathon — Протокол ФЕНИКС

Платформа хакатона (6–20 июня 2026). Киберпанк UI, без бэкенда.

## Стек
- Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Хранилище: `localStorage` (команды — ключ `phoenix_teams`, сессия — `phoenix_session`)

## Ключевые файлы
- `app/lib/auth-context.tsx` — вся логика авторизации (`register`, `login`, `logout`), типы `Team` и `Participant`
- `app/lib/mock-data.ts` — задания (`TASKS`), даты туров (`TOURNAMENT_DATES`), лидерборд (`MOCK_LEADERBOARD`)
- `app/components/navbar.tsx` — навбар с состоянием авторизации

## Страницы
- `/` — лендинг с лором
- `/register` — 2 шага: данные команды → участники (1–5 чел.)
- `/login` — вход по названию + паролю
- `/tasks` — задания; тур 1 и тур 2 переключаются вкладками; до старта — таймер
- `/leaderboard` — рейтинг с группировкой по стране/городу/школе

## Бизнес-логика
- Тип задания `extra` — только для команд 2+ участников
- Тип `boss` (тур 2) — фильтруется по `minTeamSize`, показывается только одно (последнее подходящее)
- До `TOURNAMENT_DATES.tour1Start` включается `isDemoMode` — задания видны, но помечены как ознакомительные
- Баллы и выполнение заданий сейчас хранятся только локально в состоянии компонента (не персистируются)

## Чего нет (и не нужно без явной задачи)
- Бэкенд, база данных, API-роуты
- Реальная проверка ответов (поле ввода просто отмечает задание выполненным)
- Панель администратора (флаг `isAdmin` есть в типе, но функционал не реализован

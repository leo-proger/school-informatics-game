#!/usr/bin/env tsx
/**
 * Сбрасывает БД и заливает моковые данные.
 * Использует SUPABASE_DB_URL (локальный) или remote-переменные из .env.local.
 *
 * Запуск:
 *   npm run db:reset           — локальная БД (через supabase start)
 *   npm run db:reset -- --remote — удалённая БД (осторожно!)
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// ─── Конфигурация ────────────────────────────────────────────────────────────

const isRemote = process.argv.includes("--remote");

const LOCAL_URL = "http://127.0.0.1:54321";
// Стандартные публичные demo-токены локального Supabase — не секрет,
// одинаковы для всех установок: https://supabase.com/docs/guides/local-development
const LOCAL_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7kyqd6Gz8IS0ksRuzHvh45t5C7bFgMCMeXY";
const LOCAL_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hj04zWl196z2-SBc0";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const [k, ...rest] = line.split("=");
    if (k && rest.length) process.env[k.trim()] = rest.join("=").trim();
  }
}

loadEnv();

const SUPABASE_URL = isRemote
  ? (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
  : LOCAL_URL;
const SUPABASE_KEY = isRemote
  ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "")
  : LOCAL_SERVICE_KEY;

// ─── Данные ────────────────────────────────────────────────────────────────

const TEAMS = [
  { id: "00000000-0000-0000-0000-000000000001", name: "admin",         password: "admin123", is_admin: true,  score: 0,   tour1_completed: false, tour2_completed: false },
  { id: "00000000-0000-0000-0000-000000000002", name: "Nexus Breakers", password: "pass1",  is_admin: false, score: 920, tour1_completed: true,  tour2_completed: true  },
  { id: "00000000-0000-0000-0000-000000000003", name: "VOID Hunters",   password: "pass2",  is_admin: false, score: 870, tour1_completed: true,  tour2_completed: true  },
  { id: "00000000-0000-0000-0000-000000000004", name: "Phoenix Rising", password: "pass3",  is_admin: false, score: 810, tour1_completed: true,  tour2_completed: true  },
  { id: "00000000-0000-0000-0000-000000000005", name: "Cyber Wolves",   password: "pass4",  is_admin: false, score: 780, tour1_completed: true,  tour2_completed: false },
  { id: "00000000-0000-0000-0000-000000000006", name: "Ghost Protocol", password: "pass5",  is_admin: false, score: 0,   tour1_completed: false, tour2_completed: false },
];

const PARTICIPANTS = [
  { team_id: "00000000-0000-0000-0000-000000000001", full_name: "Администратор",     city: "Москва",          school: "Администрация" },
  { team_id: "00000000-0000-0000-0000-000000000002", full_name: "Алексей Иванов",    city: "Москва",          school: "Лицей №1"      },
  { team_id: "00000000-0000-0000-0000-000000000002", full_name: "Мария Петрова",     city: "Москва",          school: "Лицей №1"      },
  { team_id: "00000000-0000-0000-0000-000000000003", full_name: "Дмитрий Сидоров",  city: "Санкт-Петербург", school: "Гимназия №5"   },
  { team_id: "00000000-0000-0000-0000-000000000003", full_name: "Анна Кузнецова",   city: "Санкт-Петербург", school: "Гимназия №5"   },
  { team_id: "00000000-0000-0000-0000-000000000004", full_name: "Игорь Смирнов",    city: "Казань",          school: "Школа №47"     },
  { team_id: "00000000-0000-0000-0000-000000000005", full_name: "Ольга Новикова",   city: "Москва",          school: "Лицей №3"      },
  { team_id: "00000000-0000-0000-0000-000000000005", full_name: "Пётр Фёдоров",     city: "Москва",          school: "Лицей №3"      },
  { team_id: "00000000-0000-0000-0000-000000000005", full_name: "Светлана Морозова",city: "Москва",          school: "Лицей №3"      },
  { team_id: "00000000-0000-0000-0000-000000000006", full_name: "Николай Волков",   city: "Новосибирск",     school: "Гимназия №2"   },
];

const TASKS_ROUND1 = [
  { title: "ИСКАЖЁННЫЙ ШИФР",    description: "Расшифруйте сообщение, закодированное шифром Цезаря со сдвигом 3:\nЗРУПСОХ — ?",                                         answer: "ВОРОНКА", hint: "Каждая буква сдвинута на 3 позиции назад в алфавите. Пример: КОТ — НСХ",  difficulty: "easy",   time_limit: 300, task_number: 1,  tour: 1, task_type: "regular" },
  { title: "ДВОИЧНЫЙ ПОТОК",     description: "Переведите двоичный код в текст:\n01010000 01001000 01001111 01000101 01001110 01001001 01011000",                        answer: "PHOENIX", hint: "Используйте таблицу ASCII",                                              difficulty: "medium", time_limit: 420, task_number: 2,  tour: 1, task_type: "regular" },
  { title: "ЛОГИЧЕСКАЯ АНОМАЛИЯ",description: "Найдите закономерность:\n2 → 6\n3 → 12\n4 → 20\n5 → 30\n6 → ?",                                                          answer: "42",      hint: "n × (n + 1)",                                                            difficulty: "medium", time_limit: 360, task_number: 3,  tour: 1, task_type: "regular" },
  { title: "МУТИРОВАВШИЙ КОД",   description: "VOID исказил код. Восстановите правильное слово:\nП_И_О_ОЛ",                                                               answer: "протокол",hint: "Системный интерфейс Phoenix Corps",                                      difficulty: "easy",   time_limit: 180, task_number: 4,  tour: 1, task_type: "regular" },
  { title: "СЕТЕВАЯ ТОПОЛОГИЯ",  description: "Если A=1, B=2, C=3... то сумма букв слова VOID равна?",                                                                    answer: "50",      hint: "V=22, O=15, I=9, D=4",                                                  difficulty: "hard",   time_limit: 480, task_number: 5,  tour: 1, task_type: "regular" },
  { title: "ШЕСТНАДЦАТЕРИЧНЫЙ КЛЮЧ", description: "Конвертируйте HEX в текст:\n4E 45 58 55 53",                                                                           answer: "NEXUS",   hint: "Используйте HEX → ASCII конвертер",                                      difficulty: "medium", time_limit: 300, task_number: 6,  tour: 1, task_type: "regular" },
  { title: "ВРЕМЕННАЯ ПЕТЛЯ",    description: "Какое число продолжит последовательность:\n1, 1, 2, 3, 5, 8, ?",                                                           answer: "13",      hint: "Числа Фибоначчи",                                                        difficulty: "easy",   time_limit: 240, task_number: 7,  tour: 1, task_type: "regular" },
  { title: "ЗЕРКАЛЬНЫЙ ШИФР",    description: "Расшифруйте слово, записанное задом наперёд:\nСУРИВ",                                                                      answer: "ВИРУС",   hint: "Прочитайте справа налево",                                               difficulty: "easy",   time_limit: 180, task_number: 8,  tour: 1, task_type: "regular" },
  { title: "КВАНТОВЫЙ БАЙТ",     description: "Сколько бит в 4 килобайтах?",                                                                                              answer: "32768",   hint: "1 байт = 8 бит, 1 КБ = 1024 байта",                                     difficulty: "hard",   time_limit: 420, task_number: 9,  tour: 1, task_type: "regular" },
  { title: "БОСС: ПРОТОКОЛ VOID",description: "Введите код доступа, собранный из букв выполненных заданий.",                                                               answer: "КОД",     hint: "Соберите первые буквы ответов на задания",                               difficulty: "boss",   time_limit: 600, task_number: 10, tour: 1, task_type: "boss"    },
];

const TASKS_ROUND2 = [
  { title: "АНАЛИЗ СЕТЕВЫХ ССЫЛОК",   description: "Определите типы ресурсов для 14 URL-адресов.", answer: "страница, файл, почта, локальный, файл, файл, файл, файл, страница, страница, файл, страница, локальный, файл", hint: "💡 .exe, .pdf, .png, .css, .zip, .log — файлы. mailto: — почта. IP и порты — локальные.", difficulty: "boss", time_limit: 600, task_number: 1, tour: 2, task_type: "boss" },
  { title: "РАБОТА С ФАЙЛАМИ",         description: "Разложите файлы по папкам и найдите повреждённые.",                                                                answer: "schedule.json, data2.csv",   hint: "💡 JSON сломан — пропущена запятая. CSV битый — нарушена структура.",              difficulty: "boss", time_limit: 600, task_number: 2, tour: 2, task_type: "boss" },
  { title: "ИГРА БЫКИ И КОРОВЫ",       description: "Подберите 3-значный код (цифры 0–9) по подсказкам.",                                                               answer: "130",                        hint: "💡 456 — нет ни одной цифры. 178 — одна на месте. 023 — две есть, но не на месте.", difficulty: "boss", time_limit: 600, task_number: 3, tour: 2, task_type: "boss" },
  { title: "ГРАФИКИ И СТАТИСТИКА",     description: "Проанализируйте логи активности по дням и классам.",                                                               answer: "2024-05-03, 10A",            hint: "💡 Скачок — день с наибольшим числом входов. Класс с наибольшей активностью.",     difficulty: "boss", time_limit: 600, task_number: 4, tour: 2, task_type: "boss" },
  { title: "КОМПЛЕКСНЫЙ МИНИ-ИНЦИДЕНТ",description: "Какой IP совершил 3 подряд неудачных запроса к /admin/panel?",                                                     answer: "203.0.113.5",                hint: "💡 Смотри на логи: GET /admin/panel с кодом 404 три раза подряд.",                  difficulty: "boss", time_limit: 600, task_number: 5, tour: 2, task_type: "boss" },
];

const SETTINGS = [
  { key: "tour1_start", value: "2026-06-09T10:00:00", label: "Начало тура 1" },
  { key: "tour1_end",   value: "2026-06-09T10:40:00", label: "Конец тура 1"  },
  { key: "tour2_start", value: "2026-06-15T11:00:00", label: "Начало тура 2" },
  { key: "tour2_end",   value: "2026-06-15T12:30:00", label: "Конец тура 2"  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(`${question} (y/N) `, answer => { rl.close(); resolve(answer.toLowerCase() === "y"); }));
}

async function truncate(db: ReturnType<typeof createClient>, table: string) {
  const { error } = await db.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw new Error(`Ошибка при очистке ${table}: ${error.message}`);
}

async function truncateSettings(db: ReturnType<typeof createClient>) {
  const { error } = await db.from("settings").delete().neq("key", "__never__");
  if (error) throw new Error(`Ошибка при очистке settings: ${error.message}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_URL) {
    console.error("❌ SUPABASE_URL не задан. Запустите `supabase start` или укажите --remote.");
    process.exit(1);
  }

  console.log(`\n🎯 Цель: ${isRemote ? "⚠️  УДАЛЁННАЯ БД" : "локальная БД"}`);
  console.log(`📡 URL: ${SUPABASE_URL}\n`);

  if (isRemote) {
    const ok = await confirm("⚠️  Это СОТРЁТ удалённую БД! Продолжить?");
    if (!ok) { console.log("Отменено."); process.exit(0); }
  }

  const db = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });

  console.log("🗑  Очистка таблиц...");
  await truncate(db, "participants");
  await truncate(db, "tasks");
  await truncateSettings(db);
  await truncate(db, "teams");

  console.log("👥 Вставка команд...");
  const { error: teamsErr } = await db.from("teams").insert(TEAMS);
  if (teamsErr) throw teamsErr;

  console.log("👤 Вставка участников...");
  const { error: partErr } = await db.from("participants").insert(PARTICIPANTS);
  if (partErr) throw partErr;

  console.log("📋 Вставка заданий...");
  const { error: t1Err } = await db.from("tasks").insert(TASKS_ROUND1);
  if (t1Err) throw t1Err;
  const { error: t2Err } = await db.from("tasks").insert(TASKS_ROUND2);
  if (t2Err) throw t2Err;

  console.log("⚙️  Вставка настроек...");
  const { error: sErr } = await db.from("settings").insert(SETTINGS);
  if (sErr) throw sErr;

  console.log(`
✅ БД успешно сброшена и заполнена моковыми данными!

Тестовые аккаунты:
  admin          / admin123  (администратор)
  Nexus Breakers / pass1     (тур 1 + 2 завершены, 920 очков)
  VOID Hunters   / pass2     (тур 1 + 2 завершены, 870 очков)
  Phoenix Rising / pass3     (тур 1 + 2 завершены, 810 очков)
  Cyber Wolves   / pass4     (тур 1 завершён, 780 очков)
  Ghost Protocol / pass5     (новая команда, 0 очков)
`);
}

main().catch(err => { console.error("❌", err); process.exit(1); });

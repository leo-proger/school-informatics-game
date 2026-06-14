import { GameTask } from "../lib/types";

export const round2BossTasks: Record<number, GameTask> = {
  1: {
    id: "boss-1",
    title: "VOID: ФИНАЛЬНЫЙ ПРОТОКОЛ (СОЛО)",
    description: "VOID задаёт последний вопрос:\n'Я — то, что нельзя увидеть, но можно измерить. Я расту, но не живу. Я поглощаю, но не ем. Что я?'",
    answer: "время",
    hint: "Оно всегда идёт вперёд",
    difficulty: "boss",
    timeLimit: 600,
    taskNumber: 1
  },
  2: {
    id: "boss-2",
    title: "VOID: КОЛЛАБОРАТИВНЫЙ ВЗЛОМ (ДУЭТ)",
    description: "Расшифруйте двойной шифр:\nШаг 1: Цезарь (сдвиг 5)\nШаг 2: Заменить цифры на буквы (1=A, 2=B...)\nЗашифровано: ЙХЧС 9-15-9-20",
    answer: "void core",
    hint: "Сначала расшифруйте Цезаря, потом конвертируйте цифры",
    difficulty: "boss",
    timeLimit: 900,
    taskNumber: 2
  },
  3: {
    id: "boss-3",
    title: "VOID: ТРОЙНАЯ СПИРАЛЬ (ТРИО)",
    description: "Решите систему:\nX + Y = 15\nY + Z = 20\nX + Z = 17\nНайдите X × Y × Z",
    answer: "792",
    hint: "Решите систему уравнений",
    difficulty: "boss",
    timeLimit: 900,
    taskNumber: 3
  },
  4: {
    id: "boss-4",
    title: "VOID: КВАНТОВЫЙ КОЛЛАПС (4 ЧЕЛ.)",
    description: "MD5 хеш пароля: 5d41402abc4b2a76b9719d911017c592\nПодсказка: это самое простое слово",
    answer: "hello",
    hint: "Попробуйте самые распространённые пароли",
    difficulty: "boss",
    timeLimit: 1200,
    taskNumber: 4
  },
  5: {
    id: "boss-5",
    title: "VOID: АБСОЛЮТНЫЙ НОЛЬ (5 ЧЕЛ.)",
    description: "Восстановите алгоритм:\nInput: 7 → Output: 111\nInput: 4 → Output: 100\nInput: 15 → Output: 1111\nInput: 42 → Output: ?",
    answer: "101010",
    hint: "Переведите в двоичную систему",
    difficulty: "boss",
    timeLimit: 1200,
    taskNumber: 5
  }
};

export function getBossTask(playerCount: number): GameTask | undefined {
  return round2BossTasks[playerCount];
}

export function checkBossAnswer(task: GameTask, input: string): boolean {
  const normalized = input.trim().toLowerCase();
  
  if (Array.isArray(task.answer)) {
    return task.answer.some(a => a.toLowerCase() === normalized);
  }
  
  return task.answer.toLowerCase() === normalized;
}
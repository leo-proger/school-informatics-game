import { GameTask } from "../lib/types";

export const round1Tasks: GameTask[] = [
  {
    id: "task-1",
    title: "ИСКАЖЁННЫЙ ШИФР",
    description: "Расшифруйте сообщение, закодированное шифром Цезаря со сдвигом 3:\nЗРУПСОХ — ?",
    answer: "ВОРОНКА",
    hint: "Каждая буква сдвинута на 3 позиции назад в алфавите. Пример: КОТ — НСХ",
    difficulty: "easy",
    timeLimit: 300,
    taskNumber: 1
  },
  {
    id: "task-2",
    title: "ДВОИЧНЫЙ ПОТОК",
    description: "Переведите двоичный код в текст:\n01010000 01001000 01001111 01000101 01001110 01001001 01011000",
    answer: "PHOENIX",
    hint: "Используйте таблицу ASCII",
    difficulty: "medium",
    timeLimit: 420,
    taskNumber: 2
  },
  {
    id: "task-3",
    title: "ЛОГИЧЕСКАЯ АНОМАЛИЯ",
    description: "Найдите закономерность:\n2 → 6\n3 → 12\n4 → 20\n5 → 30\n6 → ?",
    answer: "42",
    hint: "n × (n + 1)",
    difficulty: "medium",
    timeLimit: 360,
    taskNumber: 3
  },
  {
    id: "task-4",
    title: "МУТИРОВАВШИЙ КОД",
    description: "VOID исказил код. Восстановите правильное слово:\nП_И_О_ОЛ",
    answer: "протокол",
    hint: "Системный интерфейс Phoenix Corps",
    difficulty: "easy",
    timeLimit: 180,
    taskNumber: 4
  },
  {
    id: "task-5",
    title: "СЕТЕВАЯ ТОПОЛОГИЯ",
    description: "Если A=1, B=2, C=3... то сумма букв слова VOID равна?",
    answer: "52",
    hint: "V=22, O=15, I=9, D=4",
    difficulty: "hard",
    timeLimit: 480,
    taskNumber: 5
  },
  // Дополнительные задания для команд
  {
    id: "task-6",
    title: "ШЕСТНАДЦАТЕРИЧНЫЙ КЛЮЧ",
    description: "Конвертируйте HEX в текст:\n4E 45 58 55 53",
    answer: "NEXUS",
    hint: "Используйте HEX → ASCII конвертер",
    difficulty: "medium",
    timeLimit: 300,
    taskNumber: 6
  },
  {
    id: "task-7",
    title: "ВРЕМЕННАЯ ПЕТЛЯ",
    description: "Какое число продолжит последовательность:\n1, 1, 2, 3, 5, 8, ?",
    answer: "13",
    hint: "Числа Фибоначчи",
    difficulty: "easy",
    timeLimit: 240,
    taskNumber: 7
  },
  {
    id: "task-8",
    title: "ЗЕРКАЛЬНЫЙ ШИФР",
    description: "Расшифруйте слово, записанное задом наперёд:\nСУРИВ",
    answer: "ВИРУС",
    hint: "Прочитайте справа налево",
    difficulty: "easy",
    timeLimit: 180,
    taskNumber: 8
  },
  {
    id: "task-9",
    title: "КВАНТОВЫЙ БАЙТ",
    description: "Сколько бит в 4 килобайтах?",
    answer: "32768",
    hint: "1 байт = 8 бит, 1 КБ = 1024 байта",
    difficulty: "hard",
    timeLimit: 420,
    taskNumber: 9
  }
];

export function getTask(id: string): GameTask | undefined {
  return round1Tasks.find(t => t.id === id);
}

export function checkAnswer(task: GameTask, input: string): boolean {
  const normalized = input.trim().toLowerCase();
  
  if (Array.isArray(task.answer)) {
    return task.answer.some(a => a.toLowerCase() === normalized);
  }
  
  return task.answer.toLowerCase() === normalized;
}
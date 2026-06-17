// app/data/tasks-round2.ts

export interface Round2Task {
  id: string;
  shortTitle: string;
  fullTitle: string;
  description: string;
  options: string[];
  correctAnswer: string;
  hint?: string;
}

export const round2Tasks: Round2Task[] = [
  {
    id: "boss-task-1",
    shortTitle: "ДЕШИФРОВКА",
    fullTitle: "КТО ЕБЛАНИЛ?",
    description: "Дизайнеры долбаëбы, но кто из них ебланил больше всех?",
    options: ["Все", "Все", "Все", "Все"],
    correctAnswer: "Все",  // первый "Все" — правильный
    hint: "💡 Подсказка: их было много, но ответ один — они все ебланилы."
  },
  {
    id: "boss-task-2",
    shortTitle: "АНАЛИЗ СЕТИ",
    fullTitle: "КТО ЕБЛАНИЛ? (ЧАСТЬ 2)",
    description: "А если подумать, может кто-то ебланил сильнее?",
    options: ["Все", "Все", "Все", "Все"],
    correctAnswer: "Все",  // второй "Все" — правильный
    hint: "💡 Подсказка: все, но не все подряд."
  },
  {
    id: "boss-task-3",
    shortTitle: "ВЗЛОМ ШИФРА",
    fullTitle: "КТО ЕБЛАНИЛ? (ФИНАЛ)",
    description: "Ну а если серьезно, кто из дизайнеров ебланил?",
    options: ["Все", "Все", "Все", "Все"],
    correctAnswer: "Все",  // третий "Все" — правильный
    hint: "💡 Подсказка: третий вариант — правильный."
  },
  {
    id: "boss-task-4",
    shortTitle: "СЛЕДЫ VOID",
    fullTitle: "КТО ЕБЛАНИЛ? (БОНУС)",
    description: "Проверка на внимательность: кто из дизайнеров ебланил?",
    options: ["Все", "Все", "Все", "Все"],
    correctAnswer: "Все",  // четвёртый "Все" — правильный
    hint: "💡 Подсказка: последний вариант."
  },
  {
    id: "boss-task-5",
    shortTitle: "ФИНАЛ",
    fullTitle: "КТО ЕБЛАНИЛ? (ИТОГ)",
    description: "Итоговый вопрос: кто из дизайнеров ебланил?",
    options: ["Евгений", "Диман", "Максим", "Владос"],
    correctAnswer: "Максим",  // не первый
    hint: "💡 Подсказка: он главный дизайнер."
  }
];

export function getBossTask(index: number): Round2Task {
  return round2Tasks[index] || round2Tasks[0];
}

export function checkBossAnswer(task: Round2Task, answer: string): boolean {
  return answer === task.correctAnswer;
}
export type TaskDifficulty = "easy" | "medium" | "hard";

export interface GameTask {
  id: string;
  title: string;
  description: string;
  answer: string | string[];
  hint?: string;
  difficulty: TaskDifficulty;
  timeLimit?: number;
}

export const tasks: GameTask[] = [
  {
    id: "boot-override",
    title: "BOOT OVERRIDE",
    description: "System requests authentication key to stabilize neural link.",
    answer: "echo",
    hint: "It repeats what you say...",
    difficulty: "easy",
    timeLimit: 30,
  },
  {
    id: "sequence-lock",
    title: "SEQUENCE LOCK",
    description: "Find the missing number: 2, 4, 8, 16, ?",
    answer: "32",
    hint: "Each number doubles.",
    difficulty: "easy",
  },
  {
    id: "cipher-node",
    title: "CIPHER NODE",
    description: "Decode the message: 01001000 01101001",
    answer: "hi",
    hint: "Binary → ASCII",
    difficulty: "medium",
  },
  {
    id: "system-question",
    title: "SYSTEM QUERY",
    description: "What controls perception inside the system?",
    answer: ["mind", "consciousness", "you"],
    hint: "It's not external...",
    difficulty: "hard",
  },
];

export function getTask(id: string) {
  return tasks.find((t) => t.id === id);
}

export function checkAnswer(task: GameTask, input: string): boolean {
  const normalized = input.trim().toLowerCase();

  if (Array.isArray(task.answer)) {
    return task.answer.some((a) => a.toLowerCase() === normalized);
  }

  return task.answer.toLowerCase() === normalized;
}
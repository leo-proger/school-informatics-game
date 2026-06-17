// app/lib/types.ts

import { CharacterId } from "./characters";

export interface GameTask {
  id: string;
  title: string;
  description: string;
  answer: string | string[];
  hint?: string;
  difficulty: "easy" | "medium" | "hard" | "boss";
  timeLimit?: number;
  taskNumber: number;
}

export interface TaskNode {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  active: boolean;
  completed: boolean;
  locked: boolean;
}

// ✅ ТОЛЬКО эмоциональные состояния
export type CharacterMood = "happy" | "angry" | "mouth-open" | "mouth-closed";
export type DialogueEvent = "system" | "warning" | "danger" | "success" | "puzzle" | "info";

export interface DialogueLine {
  character: CharacterId;
  text: string;
  delay?: number;
  event?: DialogueEvent;
  mood?: CharacterMood;  // ← Всегда должно быть указано для VOID и ПРОТОКОЛ
}
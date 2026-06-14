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

export interface DialogueLine {
  character: CharacterId;
  text: string;
  delay?: number;
  event?: "system" | "warning" | "danger" | "success" | "puzzle" | "info";
}
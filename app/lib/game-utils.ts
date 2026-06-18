import { TaskNode } from "@/app/components/tasks/TaskMap";
import { GameTask } from "./types";

export const DIFFICULTY_POINTS: Record<string, number> = {
  easy: 100,
  medium: 200,
  hard: 300,
  boss: 500,
};

export function generateNodes(
  tasks: GameTask[],
  completed: string[],
  failed: string[],
  activeId: string | null
): TaskNode[] {
  return tasks.map((task, index) => {
    const isUnlocked =
      index === 0 ||
      completed.includes(tasks[index - 1].id) ||
      failed.includes(tasks[index - 1].id);
    const isFailed = failed.includes(task.id);
    const isCompleted = completed.includes(task.id);

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      x: 15 + (index % 3) * 30,
      y: 20 + Math.floor(index / 3) * 30,
      active: task.id === activeId && isUnlocked && !isFailed && !isCompleted,
      completed: isCompleted,
      locked: !isUnlocked,
      failed: isFailed,
    };
  });
}

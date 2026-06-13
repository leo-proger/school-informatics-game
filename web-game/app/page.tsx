"use client";
console.log("PAGE RENDER");

import { useState } from "react";

import GameLayout from "@/components/layout/GameLayout";
import TaskMap, { TaskNode } from "@/components/tasks/TaskMap";
import PuzzleModal from "@/components/tasks/PuzzleModal";

import { tasks, getTask, checkAnswer } from "@/data/tasks";

const initialNodes: TaskNode[] = [
  {
    id: "boot-override",
    title: "BOOT OVERRIDE",
    description: "System requests authentication key.",
    x: 20,
    y: 30,
    active: true,
    completed: false,
    locked: false,
  },
  {
    id: "sequence-lock",
    title: "SEQUENCE LOCK",
    description: "Find the missing number.",
    x: 50,
    y: 50,
    active: false,
    completed: false,
    locked: true,
  },
  {
    id: "cipher-node",
    title: "CIPHER NODE",
    description: "Decode binary message.",
    x: 70,
    y: 20,
    active: false,
    completed: false,
    locked: true,
  },
  {
    id: "system-question",
    title: "SYSTEM QUERY",
    description: "System-level question.",
    x: 80,
    y: 70,
    active: false,
    completed: false,
    locked: true,
  },
];

export default function HomePage() {
  const [nodes, setNodes] = useState<TaskNode[]>(initialNodes);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 🧠 открыть задачу
  const handleSelect = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (!node || node.locked) return;

    setActiveTaskId(id);
    setModalOpen(true);
  };

  // 🧠 проверка ответа
  const handleSubmit = (value: string) => {
    if (!activeTaskId) return false;

    const task = getTask(activeTaskId);
    if (!task) return false;

    const isCorrect = checkAnswer(task, value);

    if (isCorrect) {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === activeTaskId) {
            return { ...n, completed: true, active: false };
          }

          // 🔓 разблокируем следующий
          const currentIndex = prev.findIndex((p) => p.id === activeTaskId);
          const next = prev[currentIndex + 1];

          if (next && n.id === next.id) {
            return { ...n, locked: false, active: true };
          }

          return n;
        })
      );
    }

    setModalOpen(false);
    setActiveTaskId(null);

    return isCorrect;
  };

  return (
    <GameLayout progress={20} letters={["Ф"]}>
      <TaskMap tasks={nodes} onSelect={handleSelect} />

      <PuzzleModal
        open={modalOpen}
        title={activeTaskId ?? ""}
        description={
          activeTaskId
            ? nodes.find((n) => n.id === activeTaskId)?.description
            : ""
        }
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </GameLayout>
  );
}
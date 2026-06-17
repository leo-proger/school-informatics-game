"use client";

import TaskCard from "./TaskCard";

export interface TaskNode {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  active: boolean;
  completed: boolean;
  locked: boolean;
  failed?: boolean;
}

interface Props {
  tasks: TaskNode[];
  onSelect: (id: string) => void;
}

export default function TaskMap({ tasks, onSelect }: Props) {
  return (
    <div className="relative w-full h-[900px]">
      {/* SVG Connections */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {tasks.slice(0, -1).map((task, index) => {
          const next = tasks[index + 1];
          const d = `
            M ${task.x} ${task.y}
            C ${(task.x + next.x) / 2} ${task.y},
              ${(task.x + next.x) / 2} ${next.y},
              ${next.x} ${next.y}
          `;

          return (
            <path
              key={task.id}
              d={d}
              fill="none"
              stroke="#22d3ee"
              strokeWidth={0.5}
              opacity={0.4}
            />
          );
        })}
      </svg>

      {/* Task Nodes */}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="absolute"
          style={{
            left: `${task.x}%`,
            top: `${task.y}%`,
            transform: "translate(-50%, -50%)",
            animation: "float 5s ease-in-out infinite",
          }}
        >
          <TaskCard
            title={task.title}
            description={task.description}
            active={task.active}
            completed={task.completed}
            locked={task.locked}
            failed={task.failed || false}
            onClick={() => onSelect(task.id)}
          />
        </div>
      ))}
    </div>
  );
}
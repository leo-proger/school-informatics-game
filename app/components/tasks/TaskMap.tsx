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

export default function TaskMap({tasks, onSelect}: Props) {
	return (
		<div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 py-4">
			{tasks.map((task) => (
				<TaskCard
					key={task.id}
					title={task.title}
					description={task.description}
					active={task.active}
					completed={task.completed}
					locked={task.locked}
					failed={task.failed || false}
					onClick={() => onSelect(task.id)}
				/>
			))}
		</div>
	);
}
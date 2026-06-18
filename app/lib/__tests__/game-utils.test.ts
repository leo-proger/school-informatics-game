import { describe, it, expect } from "vitest";
import { DIFFICULTY_POINTS, generateNodes } from "../game-utils";
import type { GameTask } from "../types";

const makeTasks = (n: number): GameTask[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `t${i + 1}`,
    title: `Task ${i + 1}`,
    description: "",
    answer: "x",
    difficulty: "easy" as const,
    taskNumber: i + 1,
  }));

describe("DIFFICULTY_POINTS", () => {
  it("easy = 100", () => expect(DIFFICULTY_POINTS.easy).toBe(100));
  it("medium = 200", () => expect(DIFFICULTY_POINTS.medium).toBe(200));
  it("hard = 300", () => expect(DIFFICULTY_POINTS.hard).toBe(300));
  it("boss = 500", () => expect(DIFFICULTY_POINTS.boss).toBe(500));
});

describe("generateNodes", () => {
  it("returns one node per task", () => {
    const tasks = makeTasks(3);
    const nodes = generateNodes(tasks, [], [], null);
    expect(nodes).toHaveLength(3);
  });

  it("first task is always unlocked", () => {
    const tasks = makeTasks(3);
    const nodes = generateNodes(tasks, [], [], null);
    expect(nodes[0].locked).toBe(false);
  });

  it("second task is locked when first not completed", () => {
    const tasks = makeTasks(3);
    const nodes = generateNodes(tasks, [], [], null);
    expect(nodes[1].locked).toBe(true);
  });

  it("second task unlocks when first is completed", () => {
    const tasks = makeTasks(3);
    const nodes = generateNodes(tasks, ["t1"], [], null);
    expect(nodes[1].locked).toBe(false);
  });

  it("second task unlocks when first is failed", () => {
    const tasks = makeTasks(3);
    const nodes = generateNodes(tasks, [], ["t1"], null);
    expect(nodes[1].locked).toBe(false);
  });

  it("marks completed tasks", () => {
    const tasks = makeTasks(3);
    const nodes = generateNodes(tasks, ["t1", "t2"], [], null);
    expect(nodes[0].completed).toBe(true);
    expect(nodes[1].completed).toBe(true);
    expect(nodes[2].completed).toBe(false);
  });

  it("marks failed tasks", () => {
    const tasks = makeTasks(3);
    const nodes = generateNodes(tasks, [], ["t2"], null);
    expect(nodes[1].failed).toBe(true);
    expect(nodes[0].failed).toBe(false);
  });

  it("sets active on unlocked non-completed non-failed task matching activeId", () => {
    const tasks = makeTasks(3);
    const nodes = generateNodes(tasks, [], [], "t1");
    expect(nodes[0].active).toBe(true);
    expect(nodes[1].active).toBe(false);
  });

  it("does not set active on locked task", () => {
    const tasks = makeTasks(3);
    const nodes = generateNodes(tasks, [], [], "t2");
    expect(nodes[1].active).toBe(false);
  });

  it("does not set active on completed task", () => {
    const tasks = makeTasks(3);
    const nodes = generateNodes(tasks, ["t1"], [], "t1");
    expect(nodes[0].active).toBe(false);
  });

  it("assigns x/y positions", () => {
    const tasks = makeTasks(1);
    const nodes = generateNodes(tasks, [], [], null);
    expect(typeof nodes[0].x).toBe("number");
    expect(typeof nodes[0].y).toBe("number");
  });

  it("returns empty array for empty tasks", () => {
    expect(generateNodes([], [], [], null)).toEqual([]);
  });
});

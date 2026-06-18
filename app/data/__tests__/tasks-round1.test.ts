import { describe, it, expect } from "vitest";
import { round1Tasks, getTask, checkAnswer } from "../tasks-round1";

describe("round1Tasks", () => {
  it("has 9 tasks", () => {
    expect(round1Tasks).toHaveLength(9);
  });

  it("every task has required fields", () => {
    for (const t of round1Tasks) {
      expect(t.id).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.answer).toBeTruthy();
      expect(["easy", "medium", "hard", "boss"]).toContain(t.difficulty);
    }
  });

  it("task ids are unique", () => {
    const ids = round1Tasks.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("task numbers match array index + 1", () => {
    round1Tasks.forEach((t, i) => {
      expect(t.taskNumber).toBe(i + 1);
    });
  });
});

describe("getTask", () => {
  it("returns task by id", () => {
    const t = getTask("task-1");
    expect(t).toBeDefined();
    expect(t?.id).toBe("task-1");
  });

  it("returns undefined for unknown id", () => {
    expect(getTask("nonexistent")).toBeUndefined();
  });

  it("returns last task", () => {
    const t = getTask("task-9");
    expect(t?.taskNumber).toBe(9);
  });
});

describe("checkAnswer", () => {
  const task1 = round1Tasks.find((t) => t.id === "task-1")!;
  const task2 = round1Tasks.find((t) => t.id === "task-2")!;

  it("accepts exact correct answer", () => {
    expect(checkAnswer(task1, "ВОРОНКА")).toBe(true);
  });

  it("accepts lowercase answer", () => {
    expect(checkAnswer(task1, "воронка")).toBe(true);
  });

  it("accepts mixed-case answer", () => {
    expect(checkAnswer(task1, "Воронка")).toBe(true);
  });

  it("trims whitespace", () => {
    expect(checkAnswer(task1, "  ВОРОНКА  ")).toBe(true);
  });

  it("rejects wrong answer", () => {
    expect(checkAnswer(task1, "КОШКА")).toBe(false);
  });

  it("accepts PHOENIX for task-2", () => {
    expect(checkAnswer(task2, "PHOENIX")).toBe(true);
  });

  it("task-4 accepts lowercase stored answer", () => {
    const t = getTask("task-4")!;
    expect(checkAnswer(t, "протокол")).toBe(true);
    expect(checkAnswer(t, "ПРОТОКОЛ")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(checkAnswer(task1, "")).toBe(false);
  });
});

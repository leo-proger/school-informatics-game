import { describe, it, expect } from "vitest";
import { round2Tasks, getBossTask, checkBossAnswer } from "../tasks-round2";

describe("round2Tasks", () => {
  it("has 5 tasks", () => {
    expect(round2Tasks).toHaveLength(5);
  });

  it("every task has options array with 4 items", () => {
    for (const t of round2Tasks) {
      expect(t.options).toHaveLength(4);
    }
  });

  it("every task correctAnswer is one of its options", () => {
    for (const t of round2Tasks) {
      expect(t.options).toContain(t.correctAnswer);
    }
  });

  it("task ids are unique", () => {
    const ids = round2Tasks.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getBossTask", () => {
  it("returns task by index", () => {
    const t = getBossTask(0);
    expect(t.id).toBe("boss-task-1");
  });

  it("returns last task by index 4", () => {
    const t = getBossTask(4);
    expect(t.id).toBe("boss-task-5");
  });

  it("falls back to first task for out-of-range index", () => {
    const t = getBossTask(99);
    expect(t.id).toBe("boss-task-1");
  });

  it("falls back to first task for negative index", () => {
    const t = getBossTask(-1);
    expect(t.id).toBe("boss-task-1");
  });
});

describe("checkBossAnswer", () => {
  it("accepts each task's correctAnswer", () => {
    for (const t of round2Tasks) {
      expect(checkBossAnswer(t, t.correctAnswer)).toBe(true);
    }
  });

  it("rejects an answer that isn't the correct one", () => {
    for (const t of round2Tasks) {
      expect(checkBossAnswer(t, t.correctAnswer + "_x")).toBe(false);
    }
  });

  it("is exact-match (no trimming)", () => {
    const t = round2Tasks[0];
    expect(checkBossAnswer(t, " " + t.correctAnswer)).toBe(false);
  });
});

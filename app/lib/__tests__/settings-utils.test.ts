import { describe, it, expect } from "vitest";
import { isStartKey, isEndKey, groupSettings } from "../settings-utils";
import type { Setting } from "../settings-utils";

describe("isStartKey", () => {
  it("matches 'start'", () => expect(isStartKey("tour1_start")).toBe(true));
  it("matches 'begin'", () => expect(isStartKey("begin_tour")).toBe(true));
  it("matches cyrillic начало", () => expect(isStartKey("начало_тур1")).toBe(true));
  it("is case-insensitive", () => expect(isStartKey("START_TIME")).toBe(true));
  it("does not match unrelated key", () => expect(isStartKey("tour1_end")).toBe(false));
});

describe("isEndKey", () => {
  it("matches 'end'", () => expect(isEndKey("tour1_end")).toBe(true));
  it("matches 'finish'", () => expect(isEndKey("finish_time")).toBe(true));
  it("matches cyrillic конец", () => expect(isEndKey("конец_тур1")).toBe(true));
  it("is case-insensitive", () => expect(isEndKey("END_DATE")).toBe(true));
  it("does not match start key", () => expect(isEndKey("tour1_start")).toBe(false));
});

describe("groupSettings", () => {
  const settings: Setting[] = [
    { key: "tour1_end", value: "2026-06-15", label: "Конец тура 1" },
    { key: "tour1_start", value: "2026-06-14", label: "Начало тура 1" },
    { key: "tour2_end", value: "2026-06-20", label: "Конец тура 2" },
    { key: "tour2_start", value: "2026-06-19", label: "Начало тура 2" },
    { key: "misc_key", value: "val", label: "Misc" },
  ];

  it("groups tour1 and tour2 separately", () => {
    const groups = groupSettings(settings);
    const labels = groups.map((g) => g.groupLabel);
    expect(labels).toContain("Тур 1");
    expect(labels).toContain("Тур 2");
  });

  it("puts start before end within a group", () => {
    const groups = groupSettings(settings);
    const tour1 = groups.find((g) => g.groupLabel === "Тур 1")!;
    expect(tour1.items[0].key).toBe("tour1_start");
    expect(tour1.items[1].key).toBe("tour1_end");
  });

  it("ungrouped items land in Общие", () => {
    const groups = groupSettings(settings);
    const general = groups.find((g) => g.groupLabel === "Общие");
    expect(general).toBeDefined();
    expect(general!.items[0].key).toBe("misc_key");
  });

  it("tour groups appear before Общие", () => {
    const groups = groupSettings(settings);
    const lastLabel = groups[groups.length - 1].groupLabel;
    expect(lastLabel).toBe("Общие");
  });

  it("returns empty array for empty input", () => {
    expect(groupSettings([])).toEqual([]);
  });

  it("sorts multiple tour groups numerically", () => {
    const manyTours: Setting[] = [
      { key: "tour2_start", value: "", label: "" },
      { key: "tour1_start", value: "", label: "" },
    ];
    const groups = groupSettings(manyTours);
    expect(groups[0].groupLabel).toBe("Тур 1");
    expect(groups[1].groupLabel).toBe("Тур 2");
  });
});

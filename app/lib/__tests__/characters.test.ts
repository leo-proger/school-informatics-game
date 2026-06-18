import { describe, it, expect } from "vitest";
import { characters, getCharacter } from "../characters";
import type { CharacterId } from "../characters";

const ALL_IDS: CharacterId[] = ["protocol", "nexus", "void", "player"];

describe("characters", () => {
  it("has all 4 character entries", () => {
    expect(Object.keys(characters)).toHaveLength(4);
  });

  it.each(ALL_IDS)("%s has required fields", (id) => {
    const c = characters[id];
    expect(c.id).toBe(id);
    expect(c.name).toBeTruthy();
    expect(c.color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(c.prefix).toBeTruthy();
    expect(c.role).toBeTruthy();
    expect(c.avatarPlaceholder).toBeTruthy();
  });

  it("protocol has mouth-open and mouth-closed avatars", () => {
    expect(characters.protocol.avatarMouthOpen).toBeTruthy();
    expect(characters.protocol.avatarMouthClosed).toBeTruthy();
  });

  it("void has happy and angry avatars", () => {
    expect(characters.void.avatarHappy).toBeTruthy();
    expect(characters.void.avatarAngry).toBeTruthy();
  });
});

describe("getCharacter", () => {
  it("returns correct character for each id", () => {
    for (const id of ALL_IDS) {
      expect(getCharacter(id).id).toBe(id);
    }
  });

  it("falls back to protocol for unknown id", () => {
    // @ts-expect-error testing runtime fallback
    const c = getCharacter("unknown");
    expect(c.id).toBe("protocol");
  });

  it("protocol prefix is [PROTOCOL]", () => {
    expect(getCharacter("protocol").prefix).toBe("[PROTOCOL]");
  });

  it("void prefix is [VOID]", () => {
    expect(getCharacter("void").prefix).toBe("[VOID]");
  });
});

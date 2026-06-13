export type CharacterId =
  | "system"
  | "ai"
  | "hacker"
  | "player"
  | "unknown";

export interface Character {
  id: CharacterId;
  name: string;
  color: "cyan" | "purple" | "red" | "gray";
  prefix: string;
  glitch?: boolean;
}
export const characters: Record<CharacterId, Character> = {
  system: {
    id: "system",
    name: "SYSTEM",
    color: "red",
    prefix: "[SYS]",
    glitch: true,
  },

  ai: {
    id: "ai",
    name: "AURORA",
    color: "cyan",
    prefix: "[AI]",
  },

  hacker: {
    id: "hacker",
    name: "UNKNOWN",
    color: "purple",
    prefix: "[HCK]",
    glitch: true,
  },

  player: {
    id: "player",
    name: "YOU",
    color: "cyan",
    prefix: "[YOU]",
  },

  unknown: {
    id: "unknown",
    name: "???",
    color: "gray",
    prefix: "[???]",
  },
};
export function getCharacter(id: CharacterId): Character {
  return characters[id] ?? characters.unknown;
}
export type CharacterId = "protocol" | "nexus" | "void" | "player";

export interface Character {
  id: CharacterId;
  name: string;
  color: string;
  avatarPlaceholder: string;
  prefix: string;
  role: string;
}

export const characters: Record<CharacterId, Character> = {
  protocol: {
    id: "protocol",
    name: "ПРОТОКОЛ",
    color: "#22d3ee",
    avatarPlaceholder: "/images/avatars/protocol.png",
    prefix: "[PROTOCOL]",
    role: "Интерфейс управления Phoenix Corps"
  },
  nexus: {
    id: "nexus",
    name: "NEXUS",
    color: "#4ade80",
    avatarPlaceholder: "/images/avatars/nexus.png",
    prefix: "[NEXUS]",
    role: "Цифровая инфраструктура"
  },
  void: {
    id: "void",
    name: "VOID",
    color: "#ef4444",
    avatarPlaceholder: "/images/avatars/void.png",
    prefix: "[VOID]",
    role: "Самообучающийся вирус"
  },
  player: {
    id: "player",
    name: "ОПЕРАТОР",
    color: "#a855f7",
    avatarPlaceholder: "/images/avatars/player.png",
    prefix: "[OPERATOR]",
    role: "Специалист Phoenix Corps"
  }
};

export function getCharacter(id: CharacterId): Character {
  return characters[id];
}
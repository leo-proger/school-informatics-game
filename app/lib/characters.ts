// app/lib/characters.ts

export type CharacterId = "protocol" | "nexus" | "void" | "player";

export interface Character {
  id: CharacterId;
  name: string;
  color: string;
  avatarPlaceholder: string;  // fallback, если что-то пойдёт не так
  avatarHappy?: string;        // Для VOID (добрый)
  avatarAngry?: string;        // Для VOID (злой)
  avatarMouthOpen?: string;    // Для ПРОТОКОЛ (рот открыт)
  avatarMouthClosed?: string;  // Для ПРОТОКОЛ (рот закрыт)
  prefix: string;
  role: string;
}

export const characters: Record<CharacterId, Character> = {
  protocol: {
    id: "protocol",
    name: "ПРОТОКОЛ",
    color: "#22d3ee",
    avatarPlaceholder: "/images/avatars/protocol-mouth-open.png",  // fallback
    avatarMouthOpen: "/images/avatars/protocol-mouth-open.png",
    avatarMouthClosed: "/images/avatars/protocol-mouth-closed.png",
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
    avatarPlaceholder: "/images/avatars/void-angry.png",  // fallback
    avatarHappy: "/images/avatars/void-happy.png",
    avatarAngry: "/images/avatars/void-angry.png",
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
  if (!characters[id]) {
    console.warn(`⚠️ Персонаж "${id}" не найден, использую protocol`);
    return characters.protocol;
  }
  return characters[id];
}
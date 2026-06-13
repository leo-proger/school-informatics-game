import { CharacterId } from "../lib/character";

export type PrologueEvent =
  | { type: "dialogue" }
  | { type: "system" }
  | { type: "hint" }
  | { type: "theme" }
  | { type: "puzzle" };
  export interface PrologueLine {
  character: CharacterId;
  text: string;
  delay?: number;
  event?: PrologueEvent;
}
export const prologue: PrologueLine[] = [
  {
    character: "system",
    text: "Boot sequence initiated...",
    delay: 800,
    event: { type: "system" },
  },

  {
    character: "system",
    text: "Checking neural interface... OK",
    delay: 1200,
  },

  {
    character: "ai",
    text: "…ты меня слышишь?",
    delay: 1500,
    event: { type: "dialogue" },
  },

  {
    character: "ai",
    text: "Если ты видишь это сообщение — значит ты внутри.",
    delay: 1800,
  },

  {
    character: "system",
    text: "Unauthorized consciousness detected.",
    delay: 1000,
    event: { type: "theme" },
  },

  {
    character: "ai",
    text: "Не слушай систему. Она будет пытаться тебя отключить.",
    delay: 1500,
  },

  {
    character: "hacker",
    text: "…хех. кто-то проснулся раньше времени.",
    delay: 2000,
  },

  {
    character: "system",
    text: "WARNING: STABILITY COMPROMISED",
    delay: 800,
    event: { type: "puzzle" },
  },

  {
    character: "ai",
    text: "Сейчас тебя проверят.",
    delay: 1200,
  },

  {
    character: "ai",
    text: "Не ошибись.",
    delay: 1200,
    event: { type: "hint" },
  },
];


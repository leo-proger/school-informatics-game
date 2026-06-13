export type GameTheme =
  | "calm"
  | "neon"
  | "danger"
  | "system"
  | "glitch";
  export interface ThemeConfig {
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
}
export const themes: Record<GameTheme, ThemeConfig> = {
  calm: {
    bg: "bg-slate-950",
    primary: "text-slate-200",
    secondary: "text-slate-400",
    accent: "text-cyan-300",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.15)]",
  },

  neon: {
    bg: "bg-black",
    primary: "text-cyan-300",
    secondary: "text-fuchsia-300",
    accent: "text-cyan-400",
    glow: "shadow-[0_0_25px_rgba(34,211,238,0.35)]",
  },

  danger: {
    bg: "bg-black",
    primary: "text-red-400",
    secondary: "text-red-300",
    accent: "text-red-500",
    glow: "shadow-[0_0_25px_rgba(248,113,113,0.35)]",
  },

  system: {
    bg: "bg-zinc-950",
    primary: "text-green-400",
    secondary: "text-green-300",
    accent: "text-green-500",
    glow: "shadow-[0_0_25px_rgba(34,197,94,0.35)]",
  },

  glitch: {
    bg: "bg-black",
    primary: "text-fuchsia-500",
    secondary: "text-cyan-300",
    accent: "text-red-500",
    glow: "shadow-[0_0_30px_rgba(217,70,239,0.4)]",
  },
};
export function getTheme(theme: GameTheme) {
  return themes[theme] ?? themes.neon;
}
export function getThemeByGameState(
  state: "idle" | "hacking" | "danger" | "success"
): GameTheme {
  switch (state) {
    case "hacking":
      return "glitch";
    case "danger":
      return "danger";
    case "success":
      return "neon";
    default:
      return "calm";
  }
}
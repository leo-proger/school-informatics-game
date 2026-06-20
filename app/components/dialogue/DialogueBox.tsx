"use client";

import { useState } from "react";
import Image from "next/image";
import GlassPanel from "../ui/GlassPanel";
import CharacterPlate from "./CharacterPlate";
import TypeWriter from "./TypeWriter";

interface Props {
  speaker: string;
  avatar: string;
  color: string;
  text: string;
  onNext: () => void;
  mood?: "happy" | "angry" | "mouth-open" | "mouth-closed";
}

export default function DialogueBox({
  speaker,
  avatar,
  color,
  text,
  onNext,
  mood,
}: Props) {
  const [ready, setReady] = useState(false);

  // Выбираем аватарку в зависимости от персонажа и настроения
  const getAvatarSrc = () => {
    // VOID — добрый/злой (ОБЯЗАТЕЛЬНО одно из двух)
    if (speaker === "VOID") {
      if (mood === "happy") return "/images/avatars/void-happy.png";
      if (mood === "angry") return "/images/avatars/void-angry.png";
      // fallback — злой (по умолчанию)
      return "/images/avatars/void-angry.png";
    }

    // ПРОТОКОЛ — рот открыт/закрыт (ОБЯЗАТЕЛЬНО одно из двух)
    if (speaker === "ПРОТОКОЛ") {
      if (mood === "mouth-open") return "/images/avatars/protocol-mouth-open.png";
      if (mood === "mouth-closed") return "/images/avatars/protocol-mouth-closed.png";
      // fallback — рот открыт (по умолчанию)
      return "/images/avatars/protocol-mouth-open.png";
    }

    // Остальные — по умолчанию
    return avatar;
  };

  const avatarSrc = getAvatarSrc();

  return (
    <div className="fixed bottom-3 sm:bottom-8 left-0 right-0 z-50">
      {/* Аватарка */}
      <div className="relative z-20 ml-3 sm:ml-0 mb-2 sm:mb-8 w-fit">
        <div
          className="w-40 h-24 sm:w-96 sm:h-52 rounded-xl sm:rounded-2xl border-2 sm:border-4 overflow-hidden bg-[#0a0e1a] shadow-[0_0_80px_rgba(34,211,238,0.25)]"
          style={{
            borderColor: `${color}60`,
            boxShadow: `0 0 80px ${color}30, inset 0 0 80px ${color}10`,
          }}
        >
          <Image
            src={avatarSrc}
            alt={speaker}
            width={384}
            height={208}
            className="w-full h-full object-cover"
          />
        </div>
        <div 
          className="absolute -bottom-1 left-0 w-full h-1.5 rounded-full"
          style={{ background: color }}
        />
      </div>

      {/* Диалоговая панель */}
      <div className="px-3 sm:px-6">
        <div className="relative w-full rounded-xl">
          <div
            className="absolute inset-0 rounded-xl pointer-events-none z-10"
            style={{
              backgroundImage: `url('/images/ui/dialogue-frame.png')`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
          />

          <GlassPanel>
            <div className="flex h-[150px] sm:h-[220px] relative z-0">
              <CharacterPlate
                speaker={speaker}
                avatar=""
                color={color}
              />

              <div className="flex-1 p-3 sm:p-10 flex flex-col min-w-0">
                {/* Имя персонажа отдельной строкой (только моб.) */}
                <div className="sm:hidden flex items-center gap-2 mb-1.5 shrink-0">
                  <span className="font-mono text-[11px] font-bold tracking-widest uppercase" style={{ color }}>
                    {speaker}
                  </span>
                  <span className="flex-1 h-px rounded-full" style={{ background: `${color}55` }} />
                </div>

                <div className="flex-1 overflow-y-auto text-sm sm:text-base">
                  <TypeWriter
                    text={text}
                    speed={18}
                    onComplete={() => setReady(true)}
                  />
                </div>

                <div className="flex justify-end mt-2 sm:mt-4 shrink-0">
                  <button
                    onClick={onNext}
                    className={`
                      w-10 h-10 text-xl
                      sm:w-16 sm:h-16 sm:text-3xl
                      rounded-full
                      border
                      border-cyan-400/40
                      bg-cyan-400/10
                      text-cyan-300
                      transition-all
                      hover:scale-110
                      hover:shadow-[0_0_30px_rgba(34,211,238,.5)]
                      animate-pulse
                      ${ready ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                    `}
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
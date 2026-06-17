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
    <div className="fixed bottom-8 left-0 right-0 z-50">
      {/* Аватарка */}
      <div className="relative z-20 ml-0 mb-8">
        <div 
          className="w-96 h-52 rounded-2xl border-4 overflow-hidden bg-[#0a0e1a] shadow-[0_0_80px_rgba(34,211,238,0.25)] ml-0"
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
      <div className="px-6">
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
            <div className="flex min-h-[200px] relative z-0">
              <CharacterPlate
                speaker={speaker}
                avatar=""
                color={color}
              />

              <div className="flex-1 p-10 flex flex-col justify-between">
                <TypeWriter
                  text={text}
                  speed={18}
                  onComplete={() => setReady(true)}
                />

                <div className="flex justify-end mt-8">
                  {ready && (
                    <button
                      onClick={onNext}
                      className="
                        w-16
                        h-16
                        rounded-full
                        border
                        border-cyan-400/40
                        bg-cyan-400/10
                        text-cyan-300
                        text-3xl
                        transition-all
                        hover:scale-110
                        hover:shadow-[0_0_30px_rgba(34,211,238,.5)]
                        animate-pulse
                      "
                    >
                      ▶
                    </button>
                  )}
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
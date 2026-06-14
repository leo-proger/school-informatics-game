"use client";

import { useState } from "react";

import GlassPanel from "../ui/GlassPanel";
import CharacterPlate from "./CharacterPlate";
import TypeWriter from "./TypeWriter";

interface Props {
  speaker: string;

  avatar: string;

  color: string;

  text: string;

  onNext: () => void;
}

export default function DialogueBox({
  speaker,
  avatar,
  color,
  text,
  onNext,
}: Props) {
  const [ready, setReady] = useState(false);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-[1500px] z-50">
      <GlassPanel>
        <div className="flex min-h-[260px]">
          <CharacterPlate
            speaker={speaker}
            avatar={avatar}
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
  );
}
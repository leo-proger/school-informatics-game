"use client";

import Image from "next/image";

interface Props {
  speaker: string;
  avatar: string;
  color: string;
}

export default function CharacterPlate({ speaker, avatar, color }: Props) {
  const showAvatar = avatar && avatar.length > 0;

  return (
    <div className="flex flex-col items-center justify-center w-48 p-6 border-r border-white/5">
      {showAvatar && (
        <div
          className="w-20 h-20 rounded-full border-2 mb-4 overflow-hidden"
          style={{ borderColor: `${color}60` }}
        >
          <Image
            src={avatar}
            alt={speaker}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <span className="text-white/80 font-mono text-sm tracking-widest">
        {speaker}
      </span>
      <div
        className="w-12 h-0.5 mt-2 rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

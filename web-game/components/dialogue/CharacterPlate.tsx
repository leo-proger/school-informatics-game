"use client";

interface Props {
  speaker: string;
  avatar: string;
  color: string;
}

export default function CharacterPlate({
  speaker,
  avatar,
  color,
}: Props) {
  return (
    <div
      className="w-[220px]
      border-r
      border-white/10
      flex
      flex-col
      justify-center
      items-center
      p-8"
    >
      <div
        className="w-28
        h-28
        rounded-full
        border-4
        flex
        items-center
        justify-center
        text-6xl"
        style={{
          borderColor: color,
          boxShadow: `0 0 35px ${color}`,
        }}
      >
        {avatar}
      </div>

      <div
        className="mt-6
        text-xl
        font-bold
        tracking-[4px]"
        style={{
          color,
        }}
      >
        {speaker}
      </div>

      <div
        className="mt-4
        w-24
        h-[2px]"
        style={{
          background: color,
        }}
      />
    </div>
  );
}
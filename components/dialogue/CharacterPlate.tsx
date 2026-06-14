"use client";

interface Props {
  speaker: string;
  avatar: string;
  color: string;
}

export default function CharacterPlate({ speaker, avatar, color }: Props) {
  return (
    <div className="w-[220px] border-r border-white/10 flex flex-col justify-center items-center p-8">
      <div
        className="w-28 h-28 rounded-full border-4 flex items-center justify-center overflow-hidden"
        style={{
          borderColor: color,
          boxShadow: `0 0 35px ${color}`,
        }}
      >
        {/* Место для аватара */}
        <img 
          src={avatar} 
          alt={speaker}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Если картинка не загрузилась — показываем плейсхолдер
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = speaker[0];
            target.parentElement!.style.fontSize = '3rem';
            target.parentElement!.style.color = color;
          }}
        />
      </div>

      <div
        className="mt-6 text-xl font-bold tracking-[4px]"
        style={{ color }}
      >
        {speaker}
      </div>

      <div
        className="mt-4 w-24 h-[2px]"
        style={{ background: color }}
      />
    </div>
  );
}
"use client";

import clsx from "clsx";

interface Props {
  title: string;
  description: string;

  active: boolean;
  completed: boolean;
  locked: boolean;

  onClick: () => void;
}

export default function TaskCard({
  title,
  description,
  active,
  completed,
  locked,
  onClick,
}: Props) {
  return (
    <button
      disabled={locked}
      onClick={onClick}
      className={clsx(
        
        `
        active && "scale-110 z-10",
        !active && !completed && !locked && "opacity-70"
        relative

        w-[290px]
        h-[180px]

        rounded-[28px]

        overflow-hidden

        backdrop-blur-xl

        border

        transition-all

        duration-300

        hover:scale-105

        group
        `,

        active &&
          `
          border-cyan-400
          bg-cyan-500/10
          shadow-[0_0_35px_rgba(34,211,238,.35)]
          `,

        completed &&
          `
          border-green-400
          bg-green-500/10
          shadow-[0_0_30px_rgba(74,222,128,.3)]
          `,

        locked &&
          `
          border-white/10
          bg-black/40
          opacity-50
          cursor-not-allowed
          `
      )}
    >
      {/* Светящийся фон */}

      <div
        className="
        absolute
        inset-0

        bg-gradient-to-br

        from-white/5

        via-transparent

        to-cyan-400/5
        "
      />

      {/* Сканирующая линия */}

      {!locked && (
        <div
          className="
          absolute

          top-0

          left-[-100%]

          w-full

          h-full

          bg-gradient-to-r

          from-transparent

          via-cyan-300/20

          to-transparent

          animate-scan
          "
        />
      )}

      <div className="relative h-full flex flex-col justify-between p-7">
        <div className="flex justify-between items-start">
          <div>
            <div
              className="
              text-xs

              tracking-[4px]

              text-cyan-300/60
              "
            >
              MODULE
            </div>

            <h2
              className="
              text-2xl

              font-bold

              text-white

              mt-2
              "
            >
              {title}
            </h2>
          </div>

          <div
            className="
            w-5

            h-5

            rounded-full
            "
            style={{
              background: completed
                ? "#4ade80"
                : active
                ? "#22d3ee"
                : "#555",

              boxShadow: completed
                ? "0 0 15px #4ade80"
                : active
                ? "0 0 15px #22d3ee"
                : "none",
            }}
          />
        </div>

        <p
          className="
          text-white/70

          text-sm

          leading-relaxed
          "
        >
          {description}
        </p>

        <div className="flex justify-between items-center">
          <div
            className="
            text-cyan-300/50

            text-xs

            tracking-[3px]
            "
          >
            PHOENIX://TASK
          </div>

          {locked ? (
            <span className="text-white/40 text-xl">🔒</span>
          ) : completed ? (
            <span className="text-green-400 text-xl">✔</span>
          ) : (
            <span className="text-cyan-300 text-xl">▶</span>
          )}
        </div>
      </div>
    </button>
  );
}

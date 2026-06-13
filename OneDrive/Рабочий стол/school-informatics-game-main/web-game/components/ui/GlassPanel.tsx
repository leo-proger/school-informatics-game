"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface GlassPanelProps {
    children: ReactNode;
    className?: string;
}

export default function GlassPanel({
    children,
    className,
}: GlassPanelProps) {
    return (
        <div
            className={clsx(
                `
                rounded-[28px]
                border
                border-cyan-400/30
                bg-black/40
                backdrop-blur-xl

                shadow-[0_0_50px_rgba(34,211,238,.15)]

                overflow-hidden

                relative

                before:absolute
                before:inset-0
                before:bg-gradient-to-br
                before:from-cyan-500/5
                before:to-purple-500/5

                before:pointer-events-none

                `,
                className
            )}
        >
            {children}
        </div>
    );
}
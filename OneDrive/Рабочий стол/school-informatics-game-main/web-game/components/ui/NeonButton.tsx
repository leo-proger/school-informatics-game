"use client";

import React, { ButtonHTMLAttributes } from "react";

interface NeonButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: "cyan" | "purple" | "red";
}

export default function NeonButton({
  children,
  color = "cyan",
  className = "",
  ...props
}: NeonButtonProps) {
  const styles: Record<
    NonNullable<NeonButtonProps["color"]>,
    {
      border: string;
      bg: string;
      text: string;
      hover: string;
    }
  > = {
    cyan: {
      border: "border-cyan-400/40",
      bg: "bg-cyan-500/10",
      text: "text-cyan-300",
      hover: "hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]",
    },

    purple: {
      border: "border-fuchsia-400/40",
      bg: "bg-fuchsia-500/10",
      text: "text-fuchsia-300",
      hover: "hover:shadow-[0_0_30px_rgba(217,70,239,0.5)]",
    },

    red: {
      border: "border-red-400/40",
      bg: "bg-red-500/10",
      text: "text-red-300",
      hover: "hover:shadow-[0_0_30px_rgba(248,113,113,0.5)]",
    },
  };

  const current = styles[color];

  return (
    <button
      {...props}
      className={`
        px-8 py-3
        rounded-2xl
        border
        font-semibold
        tracking-widest
        transition-all duration-300

        hover:scale-105
        active:scale-95

        ${current.border}
        ${current.bg}
        ${current.text}
        ${current.hover}

        ${className}
      `}
    >
      {children}
    </button>
  );
}
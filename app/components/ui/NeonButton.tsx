"use client";

import React, { ButtonHTMLAttributes } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: "cyan" | "purple" | "red" | "yellow";
}

export default function NeonButton({
  children,
  color = "cyan",
  className = "",
  disabled = false,
  ...props
}: NeonButtonProps) {
  const colorStyles = {
    cyan: {
      border: "border-cyan-400/40",
      bg: "bg-cyan-500/10",
      text: "text-cyan-300",
      hover: "hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:bg-cyan-500/20",
    },
    purple: {
      border: "border-fuchsia-400/40",
      bg: "bg-fuchsia-500/10",
      text: "text-fuchsia-300",
      hover: "hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:bg-fuchsia-500/20",
    },
    red: {
      border: "border-red-400/40",
      bg: "bg-red-500/10",
      text: "text-red-300",
      hover: "hover:shadow-[0_0_30px_rgba(248,113,113,0.5)] hover:bg-red-500/20",
    },
    yellow: {
      border: "border-yellow-400/40",
      bg: "bg-yellow-500/10",
      text: "text-yellow-300",
      hover: "hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:bg-yellow-500/20",
    },
  };

  const current = colorStyles[color];

  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        px-8 py-3 rounded-2xl border font-semibold tracking-widest 
        transition-all duration-300 hover:scale-105 active:scale-95
        ${current.border} ${current.bg} ${current.text} ${current.hover}
        ${disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : "cursor-pointer"}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
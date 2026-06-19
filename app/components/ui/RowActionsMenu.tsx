"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface MenuAction {
  label: string;
  onClick: () => void;
  className?: string;
}

const MENU_WIDTH = 184;

// Меню действий строки (⋮). Рендерится в портал с position:fixed,
// поэтому не обрезается overflow-hidden таблицы; разворачивается вверх,
// если снизу мало места. Закрывается по клику вне, скроллу и Escape.
export default function RowActionsMenu({ actions }: { actions: MenuAction[] }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const place = () => {
    const b = btnRef.current?.getBoundingClientRect();
    if (!b) return;
    const estHeight = actions.length * 42 + 8;
    const spaceBelow = window.innerHeight - b.bottom;
    const top = spaceBelow < estHeight + 12 ? Math.max(8, b.top - estHeight) : b.bottom + 4;
    const left = Math.max(8, Math.min(b.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8));
    setCoords({ top, left });
  };

  useLayoutEffect(() => {
    if (open) place();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node) || btnRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onMove = () => setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="w-7 h-7 flex items-center justify-center rounded text-muted hover:text-slate-100 hover:bg-white/10 transition-colors text-lg leading-none"
      >
        ⋮
      </button>

      {open && coords && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: MENU_WIDTH }}
          className="z-[200] bg-slate-900 border border-cyan-500/30 rounded-lg shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setOpen(false); action.onClick(); }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${action.className ?? "text-cyan-300 hover:bg-cyan-500/15"}`}
            >
              {action.label}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}

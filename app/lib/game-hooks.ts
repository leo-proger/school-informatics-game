"use client";

import { useEffect, useRef } from "react";
import { saveProgressToDB } from "./game-actions";

// Предзагрузка видео: создаёт скрытые <video preload="auto"> и убирает их при размонтировании.
// Используется в обоих турах для мгновенного старта роликов.
export function useVideoPreload(srcs: string[]) {
  // srcs передаются литералом на каждый рендер — намеренно зависим только от монтирования.
  const key = srcs.join("|");
  useEffect(() => {
    const elements = srcs.map((src) => {
      const v = document.createElement("video");
      v.src = src;
      v.preload = "auto";
      v.muted = true;
      v.style.cssText = "position:fixed;top:-1px;left:-1px;width:1px;height:1px;opacity:0;pointer-events:none";
      document.body.appendChild(v);
      return v;
    });
    return () => elements.forEach((v) => v.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

// Автосохранение прогресса: пишет в localStorage сразу и в Supabase с дебаунсом 2с.
// Сохраняет только когда содержимое data реально меняется (по сериализации),
// поэтому добавляемый savedAt не вызывает лишних записей.
export function useAutoSaveProgress(
  storageKey: string,
  column: string,
  data: Record<string, unknown>,
  ready: boolean,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serialized = JSON.stringify(data);

  useEffect(() => {
    if (!ready) return;
    const payload = { ...JSON.parse(serialized), savedAt: new Date().toISOString() };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {}
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void saveProgressToDB(column, payload); }, 2000);
  }, [ready, storageKey, column, serialized]);
}

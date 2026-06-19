"use client";

import { useEffect, useRef } from "react";
import { saveProgressToDB } from "./game-actions";

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

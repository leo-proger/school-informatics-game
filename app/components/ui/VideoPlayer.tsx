"use client";

import { useEffect, useRef, useState } from "react";
import AssetLoadingScreen from "./AssetLoadingScreen";
import { loadVideo } from "@/app/lib/video-cache";

interface VideoPlayerProps {
  src: string;
  onEnded: () => void;
  onSkip: () => void;
}

export default function VideoPlayer({ src, onEnded, onSkip }: VideoPlayerProps) {
  // Состояние сбрасывается за счёт key={src} на стороне вызова (компонент перемонтируется).
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false); // видео реально начало проигрываться
  const [objectUrl, setObjectUrl] = useState<string | null>(null); // готово к показу, когда не null
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0); // для кнопки «Повторить»

  // Полная загрузка видео (из кэша или сети) ДО показа — никаких лагов буферизации.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    let createdUrl: string | null = null;
    startedRef.current = false;

    loadVideo(src, p => { if (!cancelled) setProgress(p); }, controller.signal)
      .then(url => {
        if (cancelled) { URL.revokeObjectURL(url); return; }
        createdUrl = url;
        setObjectUrl(url);
      })
      .catch((err: unknown) => {
        if (cancelled || (err as { name?: string })?.name === "AbortError") return;
        setError(true);
      });

    return () => {
      cancelled = true;
      controller.abort();
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [src, attempt]);

  // Принудительно запускаем воспроизведение (autoplay иногда не стартует сам)
  const tryPlay = () => {
    videoRef.current?.play().catch(() => {
      // автоплей заблокирован браузером — останется кнопка «Пропустить»
    });
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.currentTime > 0.2) startedRef.current = true;
  };

  // Защита от ложного "ended": идём дальше только если ролик реально доигран до конца.
  const handleEnded = () => {
    const v = videoRef.current;
    if (!v || !startedRef.current) { tryPlay(); return; }
    if (isFinite(v.duration) && v.duration > 1 && v.currentTime >= v.duration - 1) {
      onEnded();
    }
    // иначе (нулевая/неизвестная длительность) — не перескакиваем сюжет
  };

  const handleRetry = () => {
    setError(false);
    setProgress(0);
    setObjectUrl(null);
    setAttempt(a => a + 1);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      {/* Видео монтируется только когда полностью загружено → без лагов */}
      {objectUrl && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={objectUrl}
          autoPlay
          muted
          playsInline
          preload="auto"
          onLoadedData={tryPlay}
          onCanPlay={tryPlay}
          onPlaying={() => { startedRef.current = true; }}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setError(true)}
          onEnded={handleEnded}
        />
      )}

      {/* Экран загрузки поверх, пока видео скачивается целиком */}
      {(!objectUrl || error) && (
        <div className="absolute inset-0 z-40">
          <AssetLoadingScreen
            progress={error ? 0 : progress}
            error={error ? "Не удалось загрузить видео" : null}
            onRetry={error ? handleRetry : undefined}
            subtitle="Загружаем видео миссии…"
          />
        </div>
      )}

      <button
        onClick={onSkip}
        className="fixed bottom-10 right-10 z-50 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition"
      >
        Пропустить ↓
      </button>
    </div>
  );
}

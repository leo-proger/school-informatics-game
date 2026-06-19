"use client";

import { useRef, useState } from "react";
import AssetLoadingScreen from "./AssetLoadingScreen";

interface VideoPlayerProps {
  src: string;
  onEnded: () => void;
  onSkip: () => void;
}

export default function VideoPlayer({ src, onEnded, onSkip }: VideoPlayerProps) {
  // Состояние сбрасывается за счёт key={src} на стороне вызова (компонент перемонтируется).
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false); // видео реально начало проигрываться
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  // Принудительно запускаем воспроизведение (autoplay иногда не стартует сам)
  const tryPlay = () => {
    videoRef.current?.play().catch(() => {
      // автоплей заблокирован браузером — останется кнопка «Пропустить»
    });
  };

  // Прогресс буферизации (сколько секунд видео уже загружено)
  const handleProgress = () => {
    const v = videoRef.current;
    if (!v || !v.duration || !isFinite(v.duration) || v.buffered.length === 0) return;
    setProgress(Math.min(0.99, v.buffered.end(v.buffered.length - 1) / v.duration));
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v && v.currentTime > 0.2) startedRef.current = true;
  };

  // Защита от ложного "ended": переходим дальше только если ролик реально доигран.
  const handleEnded = () => {
    const v = videoRef.current;
    if (!startedRef.current) { tryPlay(); return; }
    if (v && isFinite(v.duration) && v.duration > 0 && v.currentTime < v.duration - 1) return;
    onEnded();
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setProgress(0);
    startedRef.current = false;
    videoRef.current?.load();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedData={() => { setLoading(false); tryPlay(); }}
        onCanPlay={() => { setLoading(false); tryPlay(); }}
        onPlaying={() => { setLoading(false); startedRef.current = true; }}
        onWaiting={() => setLoading(true)}
        onProgress={handleProgress}
        onTimeUpdate={handleTimeUpdate}
        onError={() => setError(true)}
        onEnded={handleEnded}
      >
        <source src={src} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>

      {/* Экран загрузки поверх видео, пока ролик буферизуется */}
      {(loading || error) && (
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

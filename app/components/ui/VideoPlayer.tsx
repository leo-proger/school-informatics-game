interface VideoPlayerProps {
  src: string;
  onEnded: () => void;
  onSkip: () => void;
}

export default function VideoPlayer({ src, onEnded, onSkip }: VideoPlayerProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        onEnded={onEnded}
      >
        <source src={src} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      <button
        onClick={onSkip}
        className="fixed bottom-10 right-10 z-50 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition"
      >
        Пропустить ↓
      </button>
    </div>
  );
}

// Полная загрузка видео с прогрессом + персистентный кэш через Cache Storage API.
//
// Почему Cache Storage, а не localStorage / sessionStorage:
//  - localStorage хранит только строки и ограничен ~5 МБ — для видео не подходит.
//  - sessionStorage живёт только в пределах вкладки.
//  - Cache Storage хранит бинарные Response, переживает перезагрузку, закрытие вкладки
//    и СБРОС ПРОГРЕССА игры (сброс чистит только localStorage + Supabase, не кэш).
// Это именно то, что нужно для показа: предзагрузили один раз — дальше всегда мгновенно.
//
// ВАЖНО про целостность: видео-теги ходят за файлом Range-запросами, поэтому в HTTP-кэше
// браузера может лежать ЧАСТИЧНЫЙ (206) ответ. Обычный fetch мог бы получить такой обрезок,
// а у наших mp4 атом moov лежит в конце файла — без него ролик «заканчивается» за секунду.
// Поэтому: качаем с { cache: "no-store" } (мимо HTTP-кэша) и проверяем длину по Content-Length.

const CACHE_VERSION = 3;
const CACHE_NAME = `phoenix-video-cache-v${CACHE_VERSION}`;

function cacheStorageAvailable(): boolean {
  return typeof caches !== "undefined";
}

// Открыть кэш и попутно снести старые версии (там могли осесть битые/обрезанные ролики).
async function openCache(): Promise<Cache | null> {
  if (!cacheStorageAvailable()) return null;
  try {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k.startsWith("phoenix-video-cache-") && k !== CACHE_NAME)
        .map(k => caches.delete(k)),
    );
    return await caches.open(CACHE_NAME);
  } catch {
    return null;
  }
}

// Скачать файл целиком (мимо HTTP-кэша), считая прогресс, и проверить целостность.
async function downloadFull(
  src: string,
  onProgress: (p: number) => void,
  signal?: AbortSignal,
): Promise<Blob> {
  const response = await fetch(src, { signal, cache: "no-store" });
  if (!response.ok || !response.body) {
    throw new Error(`Не удалось загрузить видео: ${response.status}`);
  }

  const total = Number(response.headers.get("Content-Length")) || 0;
  const reader = response.body.getReader();
  const chunks: BlobPart[] = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    chunks.push(value);
    received += value.length;
    if (total > 0) {
      onProgress(Math.min(0.99, received / total));
    } else {
      onProgress(Math.min(0.9, received / (received + 800_000)));
    }
  }

  // Файл обрезан (например, прервалось соединение) — не отдаём такой ролик.
  if (total > 0 && received !== total) {
    throw new Error(`Видео загружено не полностью: ${received}/${total} байт`);
  }

  return new Blob(chunks, { type: response.headers.get("Content-Type") || "video/mp4" });
}

/**
 * Возвращает blob-URL полностью загруженного видео.
 * Сначала пытается достать из персистентного кэша; иначе скачивает целиком
 * (с колбэком прогресса 0..1) и кладёт в кэш для следующего раза.
 *
 * Вызывающая сторона обязана вызвать URL.revokeObjectURL(url) при размонтировании.
 */
export async function loadVideo(
  src: string,
  onProgress: (p: number) => void,
  signal?: AbortSignal,
): Promise<string> {
  const cache = await openCache();

  // 1. Уже в кэше — проверяем целостность и отдаём мгновенно.
  if (cache) {
    const hit = await cache.match(src);
    if (hit) {
      const expected = Number(hit.headers.get("Content-Length")) || 0;
      const blob = await hit.blob();
      if (expected === 0 || blob.size === expected) {
        onProgress(1);
        return URL.createObjectURL(blob);
      }
      // Битая запись (обрезок) — удаляем и качаем заново.
      await cache.delete(src);
    }
  }

  // 2. Скачиваем целиком и проверяем длину.
  const blob = await downloadFull(src, onProgress, signal);

  // 3. Кладём в персистентный кэш (best-effort — ошибки квоты игнорируем).
  if (cache) {
    try {
      await cache.put(
        src,
        new Response(blob, {
          headers: {
            "Content-Type": blob.type,
            "Content-Length": String(blob.size),
          },
        }),
      );
    } catch {
      // переполнение квоты и т.п. — не критично, просто не закэшировали
    }
  }

  onProgress(1);
  return URL.createObjectURL(blob);
}

/** Предзагрузить список видео в фоне (для прогрева кэша заранее). */
export async function prefetchVideos(srcs: string[]): Promise<void> {
  await Promise.all(
    srcs.map(async src => {
      try {
        const url = await loadVideo(src, () => {});
        URL.revokeObjectURL(url);
      } catch {
        // молча — прогрев не должен ломать UI
      }
    }),
  );
}

/** Проверить, лежит ли видео уже в персистентном кэше. */
export async function isVideoCached(src: string): Promise<boolean> {
  const cache = await openCache();
  if (!cache) return false;
  return Boolean(await cache.match(src));
}

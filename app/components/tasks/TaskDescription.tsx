"use client";

// Рендерит описание задания: обычный текст + ASCII-таблицы (box-drawing)
// превращаются в нормальные HTML-таблицы — одинаковые на всех экранах.

const BOX_CHARS = /[┌┐└┘├┤┬┴│─]/;

type Block =
  | { type: "text"; text: string }
  | { type: "table"; rows: string[][] };

function parseBlocks(text: string): Block[] {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trimStart();

    if (trimmed.startsWith("┌")) {
      // Таблица: читаем до закрывающей рамки └…┘
      const rows: string[][] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("└")) {
        const t = lines[i].trimStart();
        if (t.startsWith("│")) {
          const cells = lines[i].split("│").slice(1, -1).map((c) => c.trim());
          rows.push(cells);
        }
        // строки-разделители (├──┼──┤ и т.п.) пропускаем
        i++;
      }
      i++; // пропустить строку └…┘
      if (rows.length) blocks.push({ type: "table", rows });
    } else {
      // Текст: копим до начала следующей таблицы
      const buf: string[] = [];
      while (i < lines.length && !lines[i].trimStart().startsWith("┌")) {
        buf.push(lines[i]);
        i++;
      }
      const text = buf.join("\n").replace(/^\n+|\n+$/g, "");
      if (text.trim()) blocks.push({ type: "text", text });
    }
  }

  return blocks;
}

export default function TaskDescription({ text }: { text: string }) {
  if (!text) return null;
  const blocks = parseBlocks(text);

  return (
    <div className="font-mono text-sm leading-relaxed text-gray-300">
      {blocks.map((block, idx) => {
        if (block.type === "text") {
          return (
            <p key={idx} className="whitespace-pre-wrap my-2 first:mt-0 last:mb-0">
              {block.text}
            </p>
          );
        }

        const cols = Math.max(...block.rows.map((r) => r.length));
        return (
          <div key={idx} className="my-3 overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri}>
                    {Array.from({ length: cols }).map((_, ci) => (
                      <td
                        key={ci}
                        className="border border-cyan-500/25 px-3 py-2 align-top text-gray-200 break-words"
                      >
                        {row[ci] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

// Текст для превью на карточке: только вступление, без ASCII-таблиц.
export function previewText(desc: string): string {
  if (!desc) return "";
  const out: string[] = [];
  for (const line of desc.split("\n")) {
    if (BOX_CHARS.test(line)) break;
    out.push(line);
  }
  const result = out.join("\n").trim();
  return result || desc.replace(new RegExp(BOX_CHARS.source, "g"), "").trim();
}

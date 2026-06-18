export interface Setting {
  key: string;
  value: string;
  label: string;
}

export function isBooleanKey(key: string): boolean {
  return /(show_|hide_|enable_|disable_)/i.test(key);
}

export function isStartKey(key: string): boolean {
  return /start|begin|начало/i.test(key);
}

export function isEndKey(key: string): boolean {
  return /end|finish|конец/i.test(key);
}

export function groupSettings(settings: Setting[]): { groupLabel: string; items: Setting[] }[] {
  const tourMap = new Map<string, Setting[]>();
  const ungrouped: Setting[] = [];

  for (const s of settings) {
    if (isBooleanKey(s.key)) {
      ungrouped.push(s);
      continue;
    }
    const tourMatch = s.key.match(/tour(\d+)|тур(\d+)|round(\d+)/i);
    if (tourMatch) {
      const num = tourMatch[1] ?? tourMatch[2] ?? tourMatch[3];
      const group = `tour${num}`;
      if (!tourMap.has(group)) tourMap.set(group, []);
      tourMap.get(group)!.push(s);
    } else {
      ungrouped.push(s);
    }
  }

  const result: { groupLabel: string; items: Setting[] }[] = [];

  const sortedGroups = Array.from(tourMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  for (const [group, items] of sortedGroups) {
    const num = group.replace(/\D/g, "");
    const sorted = [...items].sort((a, b) => {
      const aOrder = isStartKey(a.key) ? 0 : isEndKey(a.key) ? 1 : 2;
      const bOrder = isStartKey(b.key) ? 0 : isEndKey(b.key) ? 1 : 2;
      return aOrder - bOrder || a.key.localeCompare(b.key);
    });
    result.push({ groupLabel: `Тур ${num}`, items: sorted });
  }

  if (ungrouped.length > 0) {
    const sorted = [...ungrouped].sort((a, b) => {
      const aOrder = isStartKey(a.key) ? 0 : isEndKey(a.key) ? 1 : 2;
      const bOrder = isStartKey(b.key) ? 0 : isEndKey(b.key) ? 1 : 2;
      return aOrder - bOrder || a.key.localeCompare(b.key);
    });
    result.push({ groupLabel: "Общие", items: sorted });
  }

  return result;
}

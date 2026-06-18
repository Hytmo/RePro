// Small helpers shared across server components.
export type LocalizedText = Record<string, string> | null | undefined;

export function localizedName(name: LocalizedText, locale: string): string {
  if (!name) return '';
  return name[locale] || name['en'] || Object.values(name)[0] || '';
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
}

export function formatResponseTime(hours: number | null): string | null {
  if (hours == null) return null;
  if (hours < 1) return 'within an hour';
  if (hours < 24) return `~${Math.round(hours)} h`;
  return `~${Math.round(hours / 24)} d`;
}

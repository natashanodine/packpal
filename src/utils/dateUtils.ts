/** Parses YYYY-MM-DD as local midnight. */
export function parseLocalDate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Formats a Date as YYYY-MM-DD in local time. */
export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayString(): string {
  return toDateInputValue(new Date());
}

/**
 * Whole calendar days from today until the date.
 * 0 = today, 1 = tomorrow, negative = past.
 * Uses Date.UTC on local Y/M/D so DST changes can't produce 23/25-hour days.
 */
export function daysUntil(dateString: string, now: Date = new Date()): number {
  const target = parseLocalDate(dateString);
  const a = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const b = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((b - a) / 86_400_000);
}

export function isPast(dateString: string, now?: Date): boolean {
  return daysUntil(dateString, now) < 0;
}

/** e.g. "Wed, Oct 14, 2026" */
export function formatDate(dateString: string): string {
  return parseLocalDate(dateString).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** e.g. "Today", "Tomorrow", "In 12 days", "3 days ago" */
export function countdownLabel(dateString: string, now?: Date): string {
  const days = daysUntil(dateString, now);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days > 1) return `In ${days} days`;
  if (days === -1) return 'Yesterday';
  return `${Math.abs(days)} days ago`;
}
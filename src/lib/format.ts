// Shared formatting helpers for the showcase app.
// The countdown math mirrors the theme's countdown.js (SPEC §5): wall-clock
// parts are read with Intl.DateTimeFormat in Asia/Kolkata for BOTH the target
// and "now", so the diff is computed between two IST wall clocks and is
// immune to the viewer's local timezone / DST.

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

type IntlPartMap = Record<
  'year' | 'month' | 'day' | 'hour' | 'minute' | 'second',
  number
>;

const IST_PARTS_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

/** Reads a date's wall-clock parts in Asia/Kolkata and returns them as a pseudo-UTC ms value. */
function istWallClockMs(date: Date): number {
  const parts: IntlPartMap = {
    year: 1970,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
  };
  for (const part of IST_PARTS_FORMATTER.formatToParts(date)) {
    if (part.type in parts) {
      parts[part.type as keyof IntlPartMap] = Number(part.value);
    }
  }
  return Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
}

/**
 * Time remaining until `targetIso`, computed between IST wall clocks
 * (identical math to the Shopify theme's countdown.js).
 */
export function getCountdown(
  targetIso: string,
  now: Date = new Date(),
): CountdownParts {
  const target = new Date(targetIso);
  if (Number.isNaN(target.getTime())) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const diffMs = istWallClockMs(target) - istWallClockMs(now);
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

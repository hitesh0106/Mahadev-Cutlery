'use client';

// Festival countdown (Diwali 2026-11-08, Asia/Kolkata) — same math as the
// theme's countdown.js (Intl wall-clock parts in Asia/Kolkata, see
// src/lib/format.ts). Hydration-safe: a static placeholder renders on the
// server and until the first client tick; once the date has passed the banner
// renders nothing at all (auto-hide, exactly like the theme's Liquid check).

import { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import { getCountdown, pad2, type CountdownParts } from '@/lib/format';
import { FESTIVALS } from '@/lib/store-info';

const PLACEHOLDER: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  expired: false,
};

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-16 rounded-[var(--mc-radius-sm)] bg-white/15 px-3 py-2 text-center backdrop-blur-sm">
      <span
        aria-hidden="true"
        className="block font-heading text-2xl leading-none tracking-wide text-white sm:text-3xl"
      >
        {pad2(value)}
      </span>
      <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-white/80">
        {label}
      </span>
    </div>
  );
}

export function FestivalCountdown({ onFindGift }: { onFindGift: () => void }) {
  const festival = FESTIVALS.find((f) => f.active) ?? null;
  const [countdown, setCountdown] = useState<CountdownParts | null>(null);

  useEffect(() => {
    if (!festival) return;
    const tick = () => setCountdown(getCountdown(festival.date));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [festival]);

  if (!festival) return null;
  if (countdown?.expired) return null; // past festivals auto-hide

  const parts = countdown ?? PLACEHOLDER;
  const prettyDate = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(festival.date));

  return (
    <section
      aria-label={`Countdown to ${festival.name} — ${prettyDate}, India Standard Time`}
      className="relative overflow-hidden rounded-[var(--mc-radius)] bg-[var(--mc-accent)] px-5 py-6 shadow-[var(--mc-shadow)] sm:px-8 sm:py-8"
    >
      {/* soft decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-[var(--mc-ink)]/10 blur-2xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
            Counting down to · Asia/Kolkata
          </p>
          <h2 className="mt-1 font-heading text-3xl text-white sm:text-4xl">
            {festival.name}
          </h2>
          <p className="mt-1 text-sm text-white/85">{prettyDate} · IST</p>
          <p className="mt-2 max-w-prose text-xs leading-relaxed text-white/75">
            The theme ships with this countdown section — past festivals hide
            automatically. Dates are verified by the store owner every year.
          </p>
        </div>

        <div
          role="timer"
          aria-label={`Time left until ${festival.name}: ${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes, ${parts.seconds} seconds`}
          className="flex items-stretch gap-2 sm:gap-3"
        >
          <TimeBox value={parts.days} label="Days" />
          <TimeBox value={parts.hours} label="Hours" />
          <TimeBox value={parts.minutes} label="Mins" />
          <TimeBox value={parts.seconds} label="Secs" />
        </div>

        <button
          type="button"
          onClick={onFindGift}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[var(--mc-accent)] shadow-sm transition-all duration-[var(--mc-dur)] ease-[var(--mc-ease)] hover:-translate-y-0.5 hover:bg-[var(--mc-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Gift aria-hidden="true" className="size-4" />
          Find a Gift
        </button>
      </div>
    </section>
  );
}

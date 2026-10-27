'use client';

// Festival countdown banner — preview mirror of sections/festival-countdown.liquid.
// - Counts down to the configured festival date in Asia/Kolkata (IST, UTC+05:30).
// - Live ticker (days/hours/minutes/seconds), CTA links to the Gift Finder.
// - Honest states: upcoming → ticker; started-but-in-window → "ended" note;
//   window over (or festival disabled, e.g. Raksha Bandhan 2026) → hidden entirely.
// - Never shows a fake countdown: the date comes from FESTIVALS (owner-verified).

import { useSyncExternalStore } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { countdownParts, pickActiveFestival } from '@/lib/boutique';
import { useLang } from '@/lib/i18n';

const pad = (n: number) => String(n).padStart(2, '0');

// One-second external clock (no setState-in-effect; hydration-safe pattern).
// The snapshot MUST be cached: useSyncExternalStore calls getSnapshot on every
// render and compares with Object.is. A fresh Date.now() each call would never
// compare equal ("The result of getSnapshot should be cached" infinite loop),
// so the time only advances inside subscribeTick, right before the listener
// notification — one stable value per tick.
let nowCache: number | null = null;

function subscribeTick(onChange: () => void) {
  const id = setInterval(() => {
    nowCache = Date.now();
    onChange();
  }, 1000);
  return () => clearInterval(id);
}

const getNow = () => {
  if (nowCache === null) nowCache = Date.now();
  return nowCache;
};
const getServerNow = () => 0;

export function FestivalCountdown() {
  const { t } = useLang();
  const tick = useSyncExternalStore(subscribeTick, getNow, getServerNow);

  // Server snapshot 0 → fall back to server clock so SSR shows real values;
  // the client then re-renders from its own clock (number drift is suppressed
  // on the ticker spans below).
  const active = pickActiveFestival(tick || undefined);

  if (!active) return null;
  const { festival, state } = active;
  const units = countdownParts(active.remainingMs);

  return (
    <section
      className="border-b border-ink/60 bg-ink text-warm"
      data-testid="festival-banner"
      aria-label={`${t(festival.name)} countdown`}
    >
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 sm:px-6 lg:justify-between lg:px-10 lg:py-6">
        <div className="grid gap-1 text-center lg:text-left">
          <p className="flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-gold uppercase lg:justify-start">
            <Sparkles className="size-3.5" strokeWidth={1.5} />
            {t('Festival')}
          </p>
          <h2 className="font-serif text-[clamp(24px,2.6vw,34px)] leading-tight">
            {t(festival.name)}
          </h2>
        </div>

        {state === 'upcoming' ? (
          <>
            <div
              className="flex items-start justify-center gap-5 sm:gap-7"
              role="timer"
              aria-label={`${t(festival.name)} — ${t('Ends in')}`}
              data-testid="festival-ticker"
            >
              {(
                [
                  ['days', units.days, t('Days'), 'festival-days'],
                  ['hours', units.hours, t('Hours'), 'festival-hours'],
                  ['minutes', units.minutes, t('Minutes'), 'festival-minutes'],
                  ['seconds', units.seconds, t('Seconds'), 'festival-seconds'],
                ] as const
              ).map(([key, value, label, testId]) => (
                <div key={key} className="grid justify-items-center gap-0.5">
                  <span
                    suppressHydrationWarning
                    className="font-serif text-[clamp(26px,3vw,40px)] leading-none tabular-nums text-gold"
                    data-testid={testId}
                  >
                    {pad(value)}
                  </span>
                  <span className="text-[10.5px] tracking-[0.14em] text-warm/70 uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <a
              href={festival.link}
              data-testid="festival-cta"
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-[2px] border border-gold px-6 text-[12.5px] font-semibold tracking-[0.08em] text-gold uppercase transition-colors duration-300 hover:bg-gold hover:text-ink"
            >
              {t('Find a Gift')}
              <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-lux)] group-hover:translate-x-1" />
            </a>
          </>
        ) : (
          <p
            className="text-[13.5px] text-warm/80"
            data-testid="festival-ended-note"
            role="status"
          >
            {t('This festival period has ended. Stay tuned for the next one!')}
          </p>
        )}
      </div>
    </section>
  );
}

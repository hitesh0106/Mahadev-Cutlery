'use client';

// Dark announcement bar with rotating messages, prev/next arrows and
// auto-advance every 5s (paused on hover) — reference-exact.

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ANNOUNCEMENTS } from '@/lib/boutique';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function AnnouncementBar() {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="bg-ink text-[12.5px] tracking-[0.04em] text-warm"
      data-testid="announcement-bar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto flex min-h-[38px] max-w-[1360px] items-center justify-center gap-2 px-4">
        <button
          type="button"
          aria-label={t('Previous announcement')}
          data-testid="announcement-prev"
          className="grid size-8 place-items-center opacity-70 transition-opacity hover:opacity-100"
          onClick={() => setIndex((i) => (i - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)}
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="grid max-w-[640px] flex-1 text-center">
          {ANNOUNCEMENTS.map((message, i) => (
            <p
              key={message}
              data-testid={`announcement-message-${i}`}
              className={cn(
                '[grid-area:1/1] transition-[opacity,transform] duration-500',
                i === index ? 'opacity-100' : 'pointer-events-none translate-y-1.5 opacity-0',
              )}
            >
              {t(message)}
            </p>
          ))}
        </div>
        <button
          type="button"
          aria-label={t('Next announcement')}
          data-testid="announcement-next"
          className="grid size-8 place-items-center opacity-70 transition-opacity hover:opacity-100"
          onClick={() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length)}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

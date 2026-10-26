'use client';

// Shared boutique primitives — scroll reveal, section headings, action links,
// logo lockup and the horizontal carousel helpers (reference-exact markup).

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Scroll reveal (IntersectionObserver, staggered via --i) ─────────────────

export function Reveal({
  children,
  className,
  i = 0,
  as: Tag = 'div',
  testId,
}: {
  children: ReactNode;
  className?: string;
  i?: number;
  as?: 'div' | 'li' | 'section' | 'article';
  testId?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) {
      node.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-testid={testId}
      className={cn('reveal', className)}
      style={{ '--i': Math.min(i, 8) } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

// ── Section heading ──────────────────────────────────────────────────────────

export function SectionHead({
  eyebrow,
  title,
  text,
  action,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  action?: ReactNode;
  center?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        'mb-10 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between',
        center && 'items-center text-center md:justify-center',
      )}
    >
      <div>
        {eyebrow && (
          <p className={cn('eyebrow mb-3.5', center && 'before:hidden')}>{eyebrow}</p>
        )}
        <h2 className="text-[clamp(30px,3.6vw,46px)] leading-[1.08]">{title}</h2>
        {text && <p className="mt-3 max-w-[52ch] text-ink-2">{text}</p>}
      </div>
      {action}
    </Reveal>
  );
}

// ── Uppercase underlined action link (e.g. "Shop all →") ────────────────────

export function ActionLink({
  children,
  href = '#top',
  testId,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  testId?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      data-testid={testId}
      className="group inline-flex items-center gap-2 whitespace-nowrap border-b border-line pb-1 text-[13px] font-semibold uppercase tracking-[0.06em] transition-colors duration-300 hover:border-gold hover:text-gold"
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-lux)] group-hover:translate-x-1" />
    </a>
  );
}

// ── Logo lockup ──────────────────────────────────────────────────────────────

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#top"
      className="inline-flex flex-col gap-1.5 leading-none"
      data-testid="store-logo"
      aria-label="Mahadev home"
    >
      <span className="inline-flex items-center gap-2 font-serif text-[21px] tracking-[0.14em] xl:text-[24px]">
        <Sparkles className="hidden size-3.5 text-gold xl:block" strokeWidth={1.3} />
        MAHADEV
      </span>
      <span
        className={cn(
          'text-[7.5px] font-semibold tracking-[0.34em] xl:pl-[22px] xl:text-[8px]',
          light ? 'text-warm/60' : 'text-ink-2',
        )}
      >
        CUTLERY &amp; GIFT ARTICLES
      </span>
    </a>
  );
}

// ── Horizontal carousel helpers ──────────────────────────────────────────────

export function useCarousel() {
  const ref = useRef<HTMLUListElement | HTMLDivElement | null>(null);
  const by = (direction: number) =>
    ref.current?.scrollBy({
      left: direction * Math.max((ref.current?.clientWidth ?? 300) * 0.8, 220),
      behavior: 'smooth',
    });
  return { ref, by };
}

export function CarouselArrows({ by, name }: { by: (d: number) => void; name: string }) {
  return (
    <div className="mt-6 flex justify-end gap-2">
      {[-1, 1].map((direction) => (
        <button
          key={direction}
          type="button"
          onClick={() => by(direction)}
          aria-label={direction < 0 ? 'Scroll left' : 'Scroll right'}
          data-testid={`${name}-${direction < 0 ? 'prev' : 'next'}`}
          className="grid size-11 place-items-center rounded-full border border-line bg-paper transition-colors hover:border-ink"
        >
          {direction < 0 ? (
            <ChevronLeft className="size-5" strokeWidth={1.5} />
          ) : (
            <ChevronRight className="size-5" strokeWidth={1.5} />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Layout constants ─────────────────────────────────────────────────────────

export const CONTAINER = 'mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10';
export const SECTION_PAD = 'py-[clamp(56px,8vw,112px)]';

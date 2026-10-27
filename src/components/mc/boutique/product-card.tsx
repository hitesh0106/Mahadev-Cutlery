'use client';

// Product card + product row sections (Trending / New arrivals / Offers).
// Card: image swap on hover, sold-out / % off badges, wishlist heart,
// variant-aware quick add, vendor / title / price with compare-at.

import { Heart, Plus } from 'lucide-react';
import { inr, type BoutiqueProduct } from '@/lib/boutique';
import { useBoutique } from '@/lib/boutique-store';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { CarouselArrows, Reveal, SectionHead, ActionLink, useCarousel, SECTION_PAD } from './primitives';

export function ProductCard({ p, ctx = 'grid' }: { p: BoutiqueProduct; ctx?: string }) {
  const key = `${ctx}-${p.id}`;
  const { add, toggleWish, wishlist, view } = useBoutique();
  const { t, tf } = useLang();
  const saved = wishlist.includes(p.id);
  const discount =
    p.compareAt && p.compareAt > p.price
      ? Math.round((p.compareAt - p.price) * 100 / p.compareAt)
      : 0;

  return (
    <article
      className="group relative flex h-full flex-col gap-3.5"
      data-testid={`product-card-${key}`}
      onMouseEnter={() => view(p.id)}
    >
      <div className="relative isolate aspect-[4/5] overflow-hidden rounded-sm bg-stone">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className={cn(
            'absolute inset-0 size-full object-cover transition-[transform,opacity] duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.04]',
            p.image2 && 'group-hover:opacity-0',
            !p.available && 'opacity-75 grayscale-[.4]',
          )}
        />
        {p.image2 && (
          <img
            src={p.image2}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full scale-100 object-cover opacity-0 transition-[transform,opacity] duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.03] group-hover:opacity-100"
          />
        )}
        <div className="pointer-events-none absolute top-3 left-3 z-[2] flex flex-col gap-1.5">
          {!p.available && (
            <span
              data-testid={`product-soldout-${key}`}
              className="rounded-[2px] bg-ink px-2 py-1 text-[10.5px] font-semibold tracking-[0.1em] text-warm uppercase"
            >
              {t('Sold out')}
            </span>
          )}
          {p.available && discount > 0 && (
            <span
              data-testid={`product-discount-${key}`}
              className="rounded-[2px] bg-sale px-2 py-1 text-[10.5px] font-semibold tracking-[0.1em] text-white uppercase"
            >
              {tf('{n}% off', { n: discount })}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={tf('Save {title} to wishlist', { title: p.title })}
          aria-pressed={saved}
          onClick={() => toggleWish(p.id)}
          data-testid={`wishlist-toggle-${key}`}
          className={cn(
            'absolute top-2.5 right-2.5 z-[2] grid size-[38px] place-items-center rounded-full bg-white/90 transition-[transform,color] duration-150 hover:scale-105',
            saved && 'text-sale',
          )}
        >
          <Heart className="size-[18px]" strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} />
        </button>
        {p.available && (
          <div className="absolute inset-x-2.5 bottom-2.5 z-[2] transition-[transform,opacity] duration-500 ease-[var(--ease-lux)] sm:translate-y-[calc(100%+12px)] sm:opacity-0 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => add(p, p.variants?.[0] ?? null)}
              data-testid={`quick-add-${key}`}
              className="flex min-h-11 w-full items-center justify-between rounded-[2px] bg-white/95 px-4 text-xs font-semibold tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-ink hover:text-warm"
            >
              <span>{p.variants ? `${t('Add')} · ${p.variants[0]}` : t('Quick add')}</span>
              <Plus className="size-4" />
            </button>
          </div>
        )}
      </div>
      <div className="grid gap-1">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-2 uppercase">{p.vendor}</p>
        <h3 className="line-clamp-2 font-sans text-[14.5px] leading-snug font-medium tracking-normal">
          {p.title}
        </h3>
        <div
          className="flex items-baseline gap-2.5 font-semibold tabular-nums"
          data-testid={`product-price-${key}`}
        >
          <span className={cn(discount > 0 && 'text-sale')}>{inr(p.price)}</span>
          {discount > 0 && p.compareAt && (
            <s className="text-[.9em] font-normal text-ink-2">{inr(p.compareAt)}</s>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Product row section (used by Trending / New arrivals / Offers) ──────────

export function ProductRow({
  id,
  eyebrow,
  title,
  products,
  bg,
  carousel = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  products: BoutiqueProduct[];
  bg?: string;
  carousel?: boolean;
}) {
  const { t } = useLang();
  const { ref, by } = useCarousel();

  return (
    <section id={id} className={`${SECTION_PAD} ${bg ?? ''}`} data-testid={`${id}-section`}>
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <SectionHead
          eyebrow={t(eyebrow)}
          title={t(title)}
          action={<ActionLink testId={`${id}-view-all`}>{t('View all')}</ActionLink>}
        />
        <ul
          ref={ref}
          className={cn(
            'grid gap-x-3 gap-y-7 sm:gap-x-5',
            carousel
              ? 'no-scrollbar snap-x auto-cols-[46%] grid-flow-col overflow-x-auto md:auto-cols-[calc((100%-60px)/4)]'
              : 'grid-cols-2 md:grid-cols-4',
          )}
        >
          {products.map((p, i) => (
            <Reveal key={p.id} as="li" i={i} className="snap-start">
              <ProductCard p={p} ctx={id} />
            </Reveal>
          ))}
        </ul>
        {carousel && <CarouselArrows by={by} name={`${id}-carousel`} />}
      </div>
    </section>
  );
}

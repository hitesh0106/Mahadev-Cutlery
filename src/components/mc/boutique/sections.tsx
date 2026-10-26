'use client';

// Boutique page sections: hero, shop-by-department, featured brands,
// shop-by-product-type, the three edit stories and shop-by-budget.
// Reference-exact markup, spacing and copy.

import { ArrowRight } from 'lucide-react';
import {
  BUDGET_CARDS,
  DEPARTMENTS,
  FEATURED_BRANDS,
  BRAND_NOTES,
  img,
  PRODUCT_TYPES,
  type BoutiqueProduct,
} from '@/lib/boutique';
import { cn } from '@/lib/utils';
import { useLang } from '@/lib/i18n';
import { ProductCard } from './product-card';
import {
  ActionLink,
  CarouselArrows,
  CONTAINER,
  Reveal,
  SectionHead,
  SECTION_PAD,
  useCarousel,
} from './primitives';

// ── Hero ─────────────────────────────────────────────────────────────────────

export function Hero() {
  const { t } = useLang();
  return (
    <section className="overflow-hidden bg-warm" data-testid="hero-section">
      <div
        className={cn(
          CONTAINER,
          'grid items-center gap-8 py-10 lg:min-h-[max(78vh,760px)] lg:grid-cols-[5fr_7fr] lg:gap-20 lg:py-20',
        )}
      >
        <div className="order-2 lg:order-1">
          <p className="eyebrow mb-4 animate-rise">{t('Mahadev — Ahmedabad')}</p>
          <h1 className="animate-rise text-[clamp(40px,6.2vw,88px)] leading-[1.02] tracking-[-0.025em] [animation-delay:80ms]">
            {t('Beauty, care & gifting,')}
            <br />
            {t('beautifully curated.')}
          </h1>
          <p className="mt-6 max-w-[44ch] animate-rise text-[17px] text-ink-2 [animation-delay:160ms]">
            {t(
              'Skincare, makeup, haircare, innerwear, toys and thoughtful gifts from the brands you know, all in one considered store.',
            )}
          </p>
          <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
            <a
              href="#trending"
              data-testid="hero-shop-now-button"
              className="group inline-flex min-h-14 items-center gap-2.5 rounded-[2px] border border-ink bg-ink px-8 text-[13px] font-semibold tracking-[0.08em] text-warm uppercase transition-colors duration-300 hover:border-gold hover:bg-gold active:translate-y-px"
            >
              {t('Shop Now')}
              <ArrowRight className="size-[18px] transition-transform duration-300 ease-[var(--ease-lux)] group-hover:translate-x-1" />
            </a>
            <a
              href="#brands-az"
              data-testid="hero-explore-brands-button"
              className="inline-flex min-h-14 items-center rounded-[2px] border border-ink px-8 text-[13px] font-semibold tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-ink hover:text-warm"
            >
              {t('Explore Brands')}
            </a>
          </div>
        </div>
        <div className="relative order-1 pb-12 lg:order-2">
          <div className="aspect-[4/3.4] animate-unveil overflow-hidden rounded-sm bg-cream lg:aspect-[5/4]">
            <img
              src={img('hero-editorial')}
              alt={t('Curated beauty, gifts and jewellery arranged on cream linen')}
              className="size-full object-cover"
              fetchPriority="high"
            />
          </div>
          <a
            href="#departments"
            className="absolute right-3 bottom-0 grid w-[112px] animate-rise gap-2.5 rounded-sm bg-paper p-2.5 pb-3.5 shadow-[0_18px_40px_rgba(32,32,30,.1)] transition-transform duration-500 ease-[var(--ease-lux)] [animation-delay:420ms] hover:-translate-y-1.5 sm:w-[132px] lg:right-auto lg:-left-12 lg:w-[220px]"
            data-testid="hero-secondary-card"
          >
            <span className="aspect-[4/5] overflow-hidden rounded-[2px]">
              <img src={img('dept-jewellery')} alt="" className="size-full object-cover" />
            </span>
            <span className="flex items-center justify-between text-[11px] font-semibold tracking-[0.08em] uppercase">
              {t('Imitation jewellery')}
              <ArrowRight className="size-3.5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Departments ──────────────────────────────────────────────────────────────

export function Departments() {
  const { t } = useLang();
  return (
    <section id="departments" className={SECTION_PAD} data-testid="departments-section">
      <div className={CONTAINER}>
        <SectionHead
          eyebrow={t('Departments')}
          title={t('Shop by department')}
          action={<ActionLink testId="departments-view-all">{t('Shop all')}</ActionLink>}
        />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
          {DEPARTMENTS.map((dept, i) => (
            <Reveal key={dept.title} as="li" i={i} className={cn(i < 2 && 'lg:col-span-2')}>
              <a href="#top" className="group flex flex-col gap-3.5" data-testid={`department-card-${i}`}>
                <span
                  className={cn(
                    'relative block aspect-[3/4] overflow-hidden rounded-sm bg-cream after:absolute after:inset-0 after:rounded-sm after:border after:border-transparent after:transition-colors after:duration-300 group-hover:after:border-ink/10',
                    i < 2 && 'lg:aspect-[3/2]',
                  )}
                >
                  <img
                    src={img(dept.img)}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.06]"
                  />
                </span>
                <span className="grid grid-cols-[1fr_auto] items-end gap-x-3">
                  <span className="font-serif text-[clamp(17px,1.6vw,24px)] leading-tight transition-transform duration-300 ease-[var(--ease-lux)] group-hover:translate-x-0.5">
                    {t(dept.title)}
                  </span>
                  <span className="col-start-2 row-span-2 row-start-1 grid size-[38px] place-items-center rounded-full border border-line transition-[background-color,color,transform,border-color] duration-300 ease-[var(--ease-lux)] group-hover:translate-x-[3px] group-hover:-rotate-[35deg] group-hover:border-ink group-hover:bg-ink group-hover:text-warm">
                    <ArrowRight className="size-4" />
                  </span>
                  <span className="text-[13px] text-ink-2">{t(dept.sub)}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Featured brands ──────────────────────────────────────────────────────────

export function FeaturedBrands() {
  const { ref, by } = useCarousel();
  const { t } = useLang();

  return (
    <section className={`${SECTION_PAD} bg-warm`} data-testid="featured-brands-section">
      <div className={CONTAINER}>
        <SectionHead
          eyebrow={t('Brands we stock')}
          title={t('Featured brands')}
          action={<ActionLink testId="brands-view-all">{t('All brands A–Z')}</ActionLink>}
        />
      </div>
      <div
        ref={ref}
        tabIndex={0}
        aria-label={t('Featured brands, scroll horizontally')}
        className="no-scrollbar grid snap-x snap-mandatory auto-cols-[72%] grid-flow-col gap-3.5 overflow-x-auto px-4 sm:auto-cols-[240px] sm:px-6 lg:px-[max(40px,calc((100vw-1360px)/2+40px))]"
        data-testid="brands-carousel"
      >
        {FEATURED_BRANDS.map((brand, i) => (
          <a
            key={`${brand}-${i}`}
            href="#brands-az"
            className="group grid min-h-[180px] snap-start content-between gap-4 rounded-sm border border-line bg-paper px-6 pt-6 pb-5 transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-lux)] hover:-translate-y-[3px] hover:border-ink hover:shadow-[0_4px_14px_rgba(32,32,30,.05)]"
            data-testid={`brand-card-${i}`}
          >
            <span className="font-serif text-[26px] leading-tight">{brand}</span>
            {BRAND_NOTES[brand] && (
              <span className="text-[13px] text-ink-2">{t(BRAND_NOTES[brand])}</span>
            )}
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold tracking-[0.14em] text-ink-2 uppercase transition-colors group-hover:text-gold">
              {t('Shop')}
              <ArrowRight className="size-[15px] transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        ))}
      </div>
      <div className={CONTAINER}>
        <CarouselArrows by={by} name="brands-carousel" />
      </div>
    </section>
  );
}

// ── Shop by product type ─────────────────────────────────────────────────────

export function ProductTypes() {
  const { t } = useLang();
  return (
    <section className={`${SECTION_PAD} bg-warm`} data-testid="product-types-section">
      <div className={CONTAINER}>
        <SectionHead eyebrow={t('Find it fast')} title={t('Shop by product type')} center />
        <ul className="grid grid-cols-3 gap-x-2.5 gap-y-4 sm:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] sm:gap-x-3.5 sm:gap-y-5">
          {PRODUCT_TYPES.map((type, i) => (
            <Reveal key={type.title} as="li" i={i}>
              <a
                href="#top"
                className="group grid justify-items-center gap-2.5 text-center"
                data-testid={`product-type-${i}`}
              >
                <span className="grid aspect-square w-full max-w-[132px] place-items-center overflow-hidden rounded-full border border-line bg-paper transition-[border-color,transform,box-shadow] duration-300 ease-[var(--ease-lux)] group-hover:-translate-y-1 group-hover:border-gold group-hover:shadow-[0_4px_14px_rgba(32,32,30,.06)]">
                  <img src={img(type.img)} alt="" loading="lazy" className="size-full object-cover" />
                </span>
                <span className="text-sm font-medium">{t(type.title)}</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ── Edit stories (skincare / innerwear / gifts) ─────────────────────────────

export function EditSection({
  id,
  eyebrow,
  title,
  text,
  image,
  tone,
  right = false,
  chips,
  products,
}: {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  tone: string;
  right?: boolean;
  chips: string[];
  products: BoutiqueProduct[];
}) {
  const { t } = useLang();
  return (
    <section className={`${SECTION_PAD} ${tone}`} data-testid={`${id}-section`}>
      <div
        className={cn(
          CONTAINER,
          'grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-24',
        )}
      >
        <Reveal
          className={cn(
            'relative aspect-[4/3] overflow-hidden rounded-sm bg-warm lg:aspect-[4/5]',
            right && 'lg:order-2',
          )}
        >
          <img src={img(image)} alt="" loading="lazy" className="size-full object-cover" />
        </Reveal>
        <div className="grid content-center gap-7">
          <Reveal>
            <p className="eyebrow mb-3.5">{t(eyebrow)}</p>
            <h2 className="text-[clamp(32px,4vw,54px)] leading-[1.05]">{t(title)}</h2>
            <p className="mt-4 max-w-[46ch] text-ink-2">{t(text)}</p>
          </Reveal>
          <Reveal className="flex flex-wrap gap-2">
            {chips.map((chip, i) => (
              <a
                key={`${chip}-${i}`}
                href="#top"
                data-testid={`${id}-chip-${i}`}
                className="rounded-full border border-line bg-paper/70 px-[18px] py-2.5 text-sm transition-colors hover:border-ink"
              >
                {t(chip)}
              </a>
            ))}
          </Reveal>
          <ul className="grid grid-cols-2 gap-3 sm:gap-5">
            {products.map((p, i) => (
              <Reveal key={p.id} as="li" i={i}>
                <ProductCard p={p} ctx={id} />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Shop by budget ───────────────────────────────────────────────────────────

export function BudgetSection() {
  const { t } = useLang();
  return (
    <section className={SECTION_PAD} data-testid="budget-section">
      <div className={CONTAINER}>
        <SectionHead
          eyebrow={t('Gifting made easy')}
          title={t('Shop by budget')}
          text={t(
            'In the live theme each card links to a price-based collection you create once real prices are entered.',
          )}
        />
        <ul className="grid gap-3.5 md:grid-cols-3">
          {BUDGET_CARDS.map(([small, big], i) => (
            <Reveal key={big} as="li" i={i}>
              <a
                href="#top"
                data-testid={`budget-card-${i}`}
                className="group relative grid min-h-[170px] content-end gap-1.5 overflow-hidden rounded-sm border border-line bg-gradient-to-b from-paper to-warm p-7 transition-[border-color,transform] duration-300 ease-[var(--ease-lux)] before:absolute before:-top-10 before:-right-10 before:size-[140px] before:rounded-full before:border before:border-gold/40 before:transition-transform before:duration-500 hover:-translate-y-[3px] hover:border-ink hover:before:scale-125 md:min-h-[200px]"
              >
                <span className="text-xs tracking-[0.18em] text-ink-2 uppercase">{t(small)}</span>
                <span className="font-serif text-[clamp(36px,4vw,52px)] leading-none">{t(big)}</span>
                <ArrowRight className="absolute right-6 bottom-7 size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

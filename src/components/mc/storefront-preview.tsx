'use client';

// Storefront Preview tab: hero, festival countdown, department grid, featured
// products, brand rules strip and the device-local "recently viewed" strip.
// Every product rendered here comes from the SAMPLE catalogue served by
// /api/demo-products (src/lib/catalog.ts).

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Gift, Heart, Sparkles, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/mc/product-card';
import { FestivalCountdown } from '@/components/mc/festival-countdown';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import type { DemoProduct } from '@/lib/catalog';
import { BRAND_RULES, DEPARTMENTS } from '@/lib/catalog';
import { formatINR } from '@/lib/format';
import { translate, useLangStore } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const FEATURED_COUNT = 8;

function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  title,
  note,
  action,
}: {
  title: string;
  note?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-heading text-2xl text-[var(--mc-ink)] sm:text-3xl">{title}</h2>
        {note && <p className="mt-1 text-sm text-[var(--mc-ink-soft)]">{note}</p>}
      </div>
      {action}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: FEATURED_COUNT }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-[var(--mc-radius)]" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function StorefrontPreview({
  products,
  loading,
  departmentFilter,
  onDepartmentChange,
  onView,
  onFindGift,
}: {
  products: DemoProduct[];
  loading: boolean;
  departmentFilter: string | null;
  onDepartmentChange: (department: string | null) => void;
  onView: (product: DemoProduct) => void;
  onFindGift: () => void;
}) {
  const lang = useLangStore((s) => s.lang);
  const { items: recentlyViewed } = useRecentlyViewed();

  const filtered = departmentFilter
    ? products.filter((p) => p.department === departmentFilter)
    : null;
  const gridProducts = filtered
    ? filtered
    : products.slice(0, FEATURED_COUNT);

  const scrollToProducts = () => {
    document
      .getElementById('products-grid')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-14">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <Reveal>
        <section
          aria-label="Storefront preview hero"
          className="grid items-center gap-8 lg:grid-cols-2"
        >
          <div>
            <Badge
              variant="outline"
              className="border-[var(--mc-accent)] bg-[var(--mc-accent-soft)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--mc-accent)]"
            >
              Theme studio preview
            </Badge>
            <h1 className="mt-4 font-heading text-4xl leading-tight text-[var(--mc-ink)] sm:text-5xl">
              Everyday essentials &amp; thoughtful gifts, curated with care.
            </h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-[var(--mc-ink-soft)]">
              A design preview of the new Shopify storefront for MAHADEV
              CUTLERY &amp; GIFT ARTICLES. Everything below uses a clearly
              labeled sample catalogue — no real products, prices or stock.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                size="lg"
                onClick={onFindGift}
                className="min-h-11 rounded-full bg-[var(--mc-accent)] px-6 text-white hover:bg-[var(--mc-ink)]"
              >
                <Gift aria-hidden="true" className="size-4" />
                {translate(lang, 'action.findGift')}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={scrollToProducts}
                className="min-h-11 rounded-full border-[var(--mc-border)] px-6 text-[var(--mc-ink)] hover:border-[var(--mc-accent)] hover:bg-[var(--mc-accent-soft)]"
              >
                {translate(lang, 'action.browse')}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--mc-radius)] border border-[var(--mc-border)] shadow-[var(--mc-shadow)] lg:aspect-[5/4]">
              <Image
                src="/images/hero-lifestyle.jpg"
                alt="Warm lifestyle scene of wrapped gifts and festive decoration — AI-generated placeholder for the theme hero section"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-xs text-[var(--mc-ink-soft)]">
              AI placeholder image — the owner uploads real photos in Shopify.
            </p>
          </div>
        </section>
      </Reveal>

      <FestivalCountdown onFindGift={onFindGift} />

      {/* ── Departments ───────────────────────────────────────────────── */}
      <Reveal>
        <section id="departments" aria-labelledby="departments-heading">
          <SectionHeading
            title={translate(lang, 'section.departments')}
            note="The only 9 departments in the theme taxonomy — there is no kitchenware department."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            {DEPARTMENTS.map((department) => {
              const active = departmentFilter === department.name;
              return (
                <button
                  key={department.name}
                  type="button"
                  onClick={() => {
                    onDepartmentChange(active ? null : department.name);
                    if (!active) scrollToProducts();
                  }}
                  aria-pressed={active}
                  className={cn(
                    'group relative overflow-hidden rounded-[var(--mc-radius)] border text-left shadow-[var(--mc-shadow)] transition-all duration-[var(--mc-dur)] ease-[var(--mc-ease)] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mc-accent)]',
                    active
                      ? 'border-[var(--mc-accent)] ring-2 ring-[var(--mc-accent)]'
                      : 'border-[var(--mc-border)]',
                  )}
                >
                  <div className="relative aspect-[4/3] bg-[var(--mc-grey)]">
                    <Image
                      src={department.image}
                      alt={`${department.name} department — AI-generated sample image`}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-[var(--mc-dur)] ease-[var(--mc-ease)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--mc-ink)]/75 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <h3 className="font-heading text-lg leading-tight text-white">
                        {department.name}
                      </h3>
                      <p className="text-xs text-white/85">{department.blurb}</p>
                    </div>
                    {active && (
                      <span className="absolute right-2 top-2 rounded-full bg-white p-1.5">
                        <X aria-hidden="true" className="size-3.5 text-[var(--mc-accent)]" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </Reveal>

      {/* ── Products ──────────────────────────────────────────────────── */}
      <Reveal>
        <section id="products-grid" aria-labelledby="products-heading" className="scroll-mt-24">
          {filtered ? (
            <SectionHeading
              title={departmentFilter ?? ''}
              note={`${filtered.length} sample product${filtered.length === 1 ? '' : 's'} in this department. Departments, brands and collections are built from your real Shopify catalogue after import.`}
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDepartmentChange(null)}
                  className="min-h-11 border-[var(--mc-border)] text-[var(--mc-ink)] hover:border-[var(--mc-accent)] hover:bg-[var(--mc-accent-soft)]"
                >
                  <X aria-hidden="true" className="size-4" />
                  Clear filter
                </Button>
              }
            />
          ) : (
            <SectionHeading
              title={translate(lang, 'section.featured')}
              note="First 8 of 18 sample products — prices are sample values, availability is genuine demo data."
            />
          )}
          {loading ? (
            <ProductGridSkeleton />
          ) : gridProducts.length === 0 ? (
            <p className="rounded-[var(--mc-radius)] border border-dashed border-[var(--mc-border)] bg-[var(--mc-bg-soft)] p-8 text-center text-sm text-[var(--mc-ink-soft)]">
              No sample products in this department yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {gridProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={onView}
                  priority={index < 4}
                />
              ))}
            </div>
          )}
        </section>
      </Reveal>

      {/* ── Brand rules ───────────────────────────────────────────────── */}
      <Reveal>
        <section aria-labelledby="brand-rules-heading">
          <SectionHeading
            title={translate(lang, 'section.brandRules')}
            note="Merchandising rules enforced across the theme, the CSV/XLSX templates and the docs."
          />
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_RULES.map((brand) => (
              <li
                key={brand.brand}
                className="rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-[var(--mc-bg-soft)] p-4"
              >
                <p className="font-heading text-lg text-[var(--mc-ink)]">{brand.brand}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--mc-ink-soft)]">
                  {brand.rule}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* ── Promo band (placeholder imagery) ──────────────────────────── */}
      <Reveal>
        <section aria-label="Gift services highlights" className="grid gap-4 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-[var(--mc-radius)] border border-[var(--mc-border)] shadow-[var(--mc-shadow)]">
            <div className="relative aspect-[16/9]">
              <Image
                src="/images/gift-wrapping.jpg"
                alt="Gift wrapping station with ribbon and kraft paper — AI-generated placeholder image"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[var(--mc-dur)] ease-[var(--mc-ease)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--mc-ink)]/80 via-[var(--mc-ink)]/20 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-heading text-xl text-white">Gift wrapping options</h3>
              <p className="mt-1 max-w-prose text-sm text-white/85">
                Eligible sample products offer complimentary gift wrapping in
                this demo — on the live store the owner configures wrapping in
                Shopify.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-[var(--mc-radius)] border border-[var(--mc-border)] shadow-[var(--mc-shadow)]">
            <div className="relative aspect-[16/9]">
              <Image
                src="/images/hero-secondary.jpg"
                alt="Festive gifts arranged with warm lighting — AI-generated placeholder image"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-[var(--mc-dur)] ease-[var(--mc-ease)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--mc-ink)]/80 via-[var(--mc-ink)]/20 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-heading text-xl text-white">Festive gifting made easy</h3>
              <p className="mt-1 max-w-prose text-sm text-white/85">
                The three-step Gift Finder recommends only in-stock sample
                products tagged for each occasion — try it.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onFindGift}
                className="mt-3 min-h-11 gap-2 rounded-full bg-white text-[var(--mc-ink)] hover:bg-[var(--mc-cream)]"
              >
                <Sparkles aria-hidden="true" className="size-4 text-[var(--mc-accent)]" />
                {translate(lang, 'action.findGift')}
              </Button>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Recently viewed (device-local) ────────────────────────────── */}
      {recentlyViewed.length > 0 && (
        <Reveal>
          <section aria-labelledby="recently-viewed-heading">
            <SectionHeading
              title={translate(lang, 'section.recentlyViewed')}
              note="Saved on this device only — the theme uses the same localStorage mechanism."
            />
            <div className="mc-scroll max-h-96 overflow-y-auto rounded-[var(--mc-radius)]">
              <ul className="grid grid-cols-2 gap-4 pr-1 sm:grid-cols-4">
                {recentlyViewed.map((item) => (
                  <li key={item.handle}>
                    <button
                      type="button"
                      onClick={() => {
                        const product = products.find((p) => p.handle === item.handle);
                        if (product) onView(product);
                      }}
                      className="group flex w-full flex-col gap-2 rounded-[var(--mc-radius-sm)] border border-[var(--mc-border)] bg-white p-3 text-left shadow-[var(--mc-shadow)] transition-all duration-[var(--mc-dur)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mc-accent)]"
                    >
                      <span className="relative aspect-square overflow-hidden rounded-[var(--mc-radius-sm)] bg-[var(--mc-grey)]">
                        <Image
                          src={item.image}
                          alt={`${item.title} — sample product image`}
                          fill
                          sizes="(min-width: 640px) 25vw, 50vw"
                          className="object-cover"
                        />
                      </span>
                      <span className="line-clamp-2 text-xs font-medium leading-snug text-[var(--mc-ink)]">
                        {item.title}
                      </span>
                      <span className="text-xs text-[var(--mc-ink-soft)]">
                        {formatINR(item.priceInr)} · {translate(lang, 'label.samplePrice')}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>
      )}

      {/* Wishlist nudge */}
      <Reveal>
        <p className="flex items-center justify-center gap-2 text-center text-xs text-[var(--mc-ink-soft)]">
          <Heart aria-hidden="true" className="size-3.5 text-[var(--mc-accent)]" />
          Tap the heart on any product to save it to your wishlist — stored on
          this device only.
        </p>
      </Reveal>
    </div>
  );
}

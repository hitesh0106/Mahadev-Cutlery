'use client';

// Collection views — brand / department / product-type "pages" for the
// single-route boutique preview. Opening a brand now shows exactly what is
// inside it: its approved departments, the categories (product types) that
// belong to it, customer groups, classification rules and its verification
// status — instead of dropping the shopper back on the main page.
//
// Honesty rules (unchanged):
// - This renders CLASSIFICATION data (owner-verified brand rules), never
//   invented products. Real products appear only after the Shopify catalogue
//   is imported; the copy on every view says so explicitly.
// - The few sample items shown on department/type views keep their
//   "Sample brand" vendor and the sample-data notice stays visible.

import {
  ArrowRight,
  ArrowUpRight,
  Ban,
  ChevronRight,
  Clock3,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  DEPARTMENTS_EIGHT,
  BRANDS,
  brandDepartments,
  resolveChipTarget,
  typeEntry,
  type ChipTarget,
} from '@/lib/taxonomy';
import { BRAND_NOTES, type BoutiqueProduct } from '@/lib/boutique';
import { closeBrowse, openBrowse, useBrowse, type BrowseTarget } from '@/lib/browse-store';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ProductCard } from './product-card';
import { CONTAINER } from './primitives';

const VERIFICATION_META: Record<
  string,
  { icon: typeof ShieldCheck; key: string; tone: string; testId: string }
> = {
  'rule-verified': {
    icon: ShieldCheck,
    key: 'Classification confirmed · stock is verified product by product',
    tone: 'text-emerald-700',
    testId: 'collection-verification-ok',
  },
  'stock-verification-required': {
    icon: Clock3,
    key: 'Every product needs owner verification before publishing',
    tone: 'text-[#8A5A2B]',
    testId: 'collection-verification-pending',
  },
  'identity-unverified': {
    icon: HelpCircle,
    key: 'Brand identity pending verification — nothing published yet',
    tone: 'text-[#8A5A2B]',
    testId: 'collection-verification-unverified',
  },
};

// ── Shared pieces ────────────────────────────────────────────────────────────

function SectionTitle({ children, testId }: { children: React.ReactNode; testId?: string }) {
  return (
    <h2
      data-testid={testId}
      className="mb-4 font-serif text-[clamp(20px,2.2vw,28px)] leading-tight"
    >
      {children}
    </h2>
  );
}

function ChipLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-2">
      {children}
    </span>
  );
}

/** Clickable chip → navigates to a brand / department / type view. */
function ChipLink({
  label,
  target,
  index,
  prefix,
}: {
  label: string;
  target: ChipTarget;
  index: number;
  prefix: string;
}) {
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={() => openBrowse(target as BrowseTarget)}
      data-testid={`${prefix}-chip-${index}`}
      data-target={`${target.kind}:${target.name}`}
      className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-sm transition-colors duration-300 hover:border-ink"
    >
      {t(label)}
      <ArrowUpRight
        className="size-3.5 text-ink-2 transition-all duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-gold"
        aria-hidden
      />
    </button>
  );
}

/** Renders a list of labels as chips — clickable when an approved target exists. */
function ChipCloud({ labels, prefix }: { labels: string[]; prefix: string }) {
  return (
    <div className="flex flex-wrap gap-2" data-testid={`${prefix}-chips`}>
      {labels.map((label, i) => {
        const target = resolveChipTarget(label);
        return target ? (
          <ChipLink key={`${label}-${i}`} label={label} target={target} index={i} prefix={prefix} />
        ) : (
          <ChipLabel key={`${label}-${i}`}>{label}</ChipLabel>
        );
      })}
    </div>
  );
}

/** Mini department / brand card used across the collection views. */
function MiniCard({
  title,
  sub,
  onClick,
  testId,
}: {
  title: string;
  sub: string;
  onClick: () => void;
  testId: string;
}) {
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className="group grid min-h-[104px] content-between gap-3 rounded-sm border border-line bg-paper px-5 py-4 text-left transition-[border-color,transform,box-shadow] duration-300 ease-[var(--ease-lux)] hover:-translate-y-[2px] hover:border-ink hover:shadow-[0_4px_14px_rgba(32,32,30,.05)]"
    >
      <span className="font-serif text-[19px] leading-tight">{t(title)}</span>
      <span className="flex items-center justify-between gap-2 text-[13px] text-ink-2">
        <span className="line-clamp-1">{t(sub)}</span>
        <ArrowRight
          className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </button>
  );
}

function NoteBox({
  children,
  testId,
}: {
  children: React.ReactNode;
  testId?: string;
}) {
  return (
    <p
      data-testid={testId}
      className="max-w-[72ch] rounded-sm border border-line bg-warm px-5 py-4 text-[14px] leading-relaxed text-ink-2"
    >
      {children}
    </p>
  );
}

/** Sample products grid + honest labelling. */
function SampleProducts({
  products,
  emptyHint,
}: {
  products: BoutiqueProduct[];
  emptyHint: string;
}) {
  const { t } = useLang();
  return (
    <div data-testid="collection-products">
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
        <SectionTitle testId="collection-products-title">{t('Sample products')}</SectionTitle>
        <span className="rounded-full bg-blush px-3 py-1 text-[11.5px] font-medium text-[#4A3320]">
          {t('Sample data in this preview. The theme uses your real catalogue.')}
        </span>
      </div>
      {products.length ? (
        <ul className="grid grid-cols-2 gap-x-3 gap-y-7 md:grid-cols-4 sm:gap-x-5">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard p={p} ctx="collection" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-[60ch] text-ink-2" data-testid="collection-products-empty">
          {t(emptyHint)}
        </p>
      )}
    </div>
  );
}

// ── Brand view ───────────────────────────────────────────────────────────────

function BrandView({ name }: { name: string }) {
  const { t, tf } = useLang();
  const profile = BRANDS.find((b) => b.brand === name);
  const depts = brandDepartments(name);
  const note = BRAND_NOTES[name];
  const verification = profile ? VERIFICATION_META[profile.verification] : null;

  return (
    <div className="grid gap-12">
      <div className="grid gap-4">
        {note && <p className="max-w-[56ch] text-[16px] text-ink-2">{t(note)}</p>}
        {verification && (
          <p
            className={cn('inline-flex items-center gap-2 text-[13.5px] font-semibold', verification.tone)}
            data-testid={verification.testId}
          >
            <verification.icon className="size-4.5" strokeWidth={1.6} />
            {t(verification.key)}
          </p>
        )}
        {profile &&
          (profile.verification === 'stock-verification-required' ||
            profile.verification === 'identity-unverified') && (
            <NoteBox testId="collection-pending-note">
              {t('This brand stays unpublished until the merchant verifies the exact products.')}
            </NoteBox>
          )}
      </div>

      {depts.length > 0 && (
        <section>
          <SectionTitle testId="brand-departments-title">
            {t('Departments for this brand')}
          </SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {depts.map((deptName) => {
              const dept = DEPARTMENTS_EIGHT.find((d) => d.name === deptName);
              return (
                <MiniCard
                  key={deptName}
                  title={deptName}
                  sub={dept?.blurb ?? ''}
                  onClick={() => openBrowse({ kind: 'department', name: deptName })}
                  testId={`brand-dept-${deptName.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                />
              );
            })}
          </div>
        </section>
      )}

      {profile && profile.allowedTypes.length > 0 && (
        <section>
          <SectionTitle testId="brand-categories-title">
            {t('Categories in this brand')}
          </SectionTitle>
          <ChipCloud labels={profile.allowedTypes} prefix="brand-type" />
        </section>
      )}

      {profile && profile.allowedAudiences.length > 0 && (
        <section>
          <SectionTitle>{t('Customer groups')}</SectionTitle>
          <ChipCloud labels={profile.allowedAudiences} prefix="brand-audience" />
        </section>
      )}

      {profile && profile.prohibited.length > 0 && (
        <section data-testid="brand-rules">
          <SectionTitle>{t('Classification rules')}</SectionTitle>
          <ul className="grid max-w-[72ch] gap-2.5">
            {profile.prohibited.map((rule, i) => (
              <li key={i} className="flex items-start gap-3 text-[14.5px] text-ink-2">
                <Ban className="mt-0.5 size-4 shrink-0 text-[#8A5A2B]" strokeWidth={1.6} aria-hidden />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <NoteBox testId="brand-catalogue-note">
        {tf(
          'Real {brand} products appear here once the catalogue is imported into Shopify. Until then this page lists the approved classification only.',
          { brand: name },
        )}
      </NoteBox>
    </div>
  );
}

// ── Department view ──────────────────────────────────────────────────────────

function DepartmentView({
  name,
  products,
}: {
  name: string;
  products: BoutiqueProduct[];
}) {
  const { t } = useLang();
  const dept = DEPARTMENTS_EIGHT.find((d) => d.name === name);
  if (!dept) return null;

  const deptBrands = BRANDS.filter((b) => brandDepartments(b.brand).includes(name)).map(
    (b) => b.brand,
  );
  const sample = products.filter((p) => p.dept === dept.handle);

  return (
    <div className="grid gap-12">
      <p className="max-w-[56ch] text-[16px] text-ink-2">{t(dept.blurb)}</p>

      <section>
        <SectionTitle testId="dept-categories-title">
          {t('Categories in this department')}
        </SectionTitle>
        <ChipCloud labels={dept.types} prefix="dept-type" />
      </section>

      {deptBrands.length > 0 && (
        <section>
          <SectionTitle testId="dept-brands-title">{t('Brands in this department')}</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {deptBrands.map((brand) => (
              <MiniCard
                key={brand}
                title={brand}
                sub={BRAND_NOTES[brand] ?? t('Shop')}
                onClick={() => openBrowse({ kind: 'brand', name: brand })}
                testId={`dept-brand-${brand.toLowerCase().replace(/[^a-z]+/g, '-')}`}
              />
            ))}
          </div>
        </section>
      )}

      <SampleProducts
        products={sample}
        emptyHint="No sample products here yet. In the live theme this grid lists real products from your Shopify catalogue."
      />
    </div>
  );
}

// ── Product-type view ────────────────────────────────────────────────────────

function TypeView({
  name,
  products,
}: {
  name: string;
  products: BoutiqueProduct[];
}) {
  const { t } = useLang();
  const entry = typeEntry(name);
  if (!entry) return null;

  const deptHandles = entry.depts
    .map((deptName) => DEPARTMENTS_EIGHT.find((d) => d.name === deptName)?.handle)
    .filter(Boolean) as string[];

  const carryingBrands = BRANDS.filter((b) =>
    b.allowedTypes.some((at) => {
      const l = at.toLowerCase();
      return entry.kw.some((k) => l.includes(k));
    }),
  ).map((b) => b.brand);

  const sample = products.filter(
    (p) =>
      p.dept &&
      deptHandles.includes(p.dept) &&
      entry.kw.some((k) => p.title.toLowerCase().includes(k)),
  );

  return (
    <div className="grid gap-12">
      {entry.depts.length > 0 && (
        <section>
          <SectionTitle testId="type-departments-title">{t('Where you find it')}</SectionTitle>
          <div className="flex flex-wrap gap-2" data-testid="type-dept-chips">
            {entry.depts.map((deptName, i) => (
              <ChipLink
                key={deptName}
                label={deptName}
                target={{ kind: 'department', name: deptName }}
                index={i}
                prefix="type-dept"
              />
            ))}
          </div>
        </section>
      )}

      {carryingBrands.length > 0 && (
        <section>
          <SectionTitle testId="type-brands-title">{t('Brands carrying this type')}</SectionTitle>
          <div className="flex flex-wrap gap-2" data-testid="type-brand-chips">
            {carryingBrands.map((brand, i) => (
              <ChipLink
                key={brand}
                label={brand}
                target={{ kind: 'brand', name: brand }}
                index={i}
                prefix="type-brand"
              />
            ))}
          </div>
        </section>
      )}

      <SampleProducts
        products={sample}
        emptyHint="No sample products here yet. In the live theme this grid lists real products from your Shopify catalogue."
      />
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

const KIND_LABEL: Record<BrowseTarget['kind'], string> = {
  brand: 'Brand',
  department: 'Department',
  type: 'Product type',
};

export function CollectionView({ products }: { products: BoutiqueProduct[] }) {
  const { browse, closeBrowse } = useBrowse();
  const { t } = useLang();

  if (!browse) return null;
  const kindLabel = t(KIND_LABEL[browse.kind]);

  return (
    <div className="pb-[clamp(56px,8vw,96px)]" data-testid="collection-view">
      <nav
        aria-label={t('Breadcrumb')}
        className={cn(CONTAINER, 'flex flex-wrap items-center gap-2 pt-6 text-[13px] text-ink-2')}
      >
        <button
          type="button"
          onClick={closeBrowse}
          data-testid="collection-home"
          className="underline-offset-4 transition-colors hover:text-gold hover:underline"
        >
          {t('Home')}
        </button>
        <ChevronRight className="size-3.5 text-line" aria-hidden />
        <span>{kindLabel}</span>
        <ChevronRight className="size-3.5 text-line" aria-hidden />
        <span className="text-ink" aria-current="page">
          {browse.name}
        </span>
      </nav>

      <header className={cn(CONTAINER, 'grid gap-3 pt-5')}>
        <p className="eyebrow">{kindLabel}</p>
        <h1
          className="text-[clamp(34px,4.6vw,64px)] leading-[1.04] tracking-[-0.02em]"
          data-testid="collection-title"
        >
          {browse.name}
        </h1>
      </header>

      <div className={cn(CONTAINER, 'pt-9')}>
        {browse.kind === 'brand' && <BrandView name={browse.name} />}
        {browse.kind === 'department' && <DepartmentView name={browse.name} products={products} />}
        {browse.kind === 'type' && <TypeView name={browse.name} products={products} />}
      </div>
    </div>
  );
}

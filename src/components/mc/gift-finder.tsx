'use client';

// Gift Finder — 3-step wizard (occasion → recipient → budget) mirroring the
// theme's gift-finder.js. Matching runs on the SAMPLE catalogue via the same
// findGifts() helper + gf-* tag conventions the Shopify theme uses.

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Banknote,
  Cake,
  Coins,
  Crown,
  Gem,
  Heart,
  HeartHandshake,
  Home,
  RotateCcw,
  SearchX,
  Sparkles,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/mc/product-card';
import type { DemoProduct } from '@/lib/catalog';
import { findGifts, GIFT_FINDER_OPTIONS } from '@/lib/catalog';
import { translate, useLangStore } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Option = { value: string; label: string };

const STEP_META = [
  { key: 'occasion' as const, title: 'What’s the occasion?', icon: Sparkles },
  { key: 'recipient' as const, title: 'Who is it for?', icon: Heart },
  { key: 'budget' as const, title: 'What’s your budget?', icon: Wallet },
];

const OPTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'gf-oc-diwali': Sparkles,
  'gf-oc-rakhi': HeartHandshake,
  'gf-oc-birthday': Cake,
  'gf-oc-anniversary': Gem,
  'gf-oc-wedding': Heart,
  'gf-for-her': User,
  'gf-for-him': User,
  'gf-for-kids': Baby,
  'gf-for-couple': Users,
  'gf-for-family': Home,
  'gf-under-199': Coins,
  'gf-199-499': Wallet,
  'gf-500-999': Banknote,
  'gf-1000-plus': Crown,
};

function OptionGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly Option[];
  value: string | null;
  onChange: (value: string) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = options.findIndex((option) => option.value === value);
    let nextIndex = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1 + options.length) % options.length;
      if (currentIndex === -1) nextIndex = 0;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
      if (currentIndex === -1) nextIndex = options.length - 1;
    } else if (event.key === ' ' || event.key === 'Enter') {
      return; // buttons handle activation natively
    } else {
      return;
    }
    event.preventDefault();
    const next = options[nextIndex];
    if (next) {
      onChange(next.value);
      refs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {options.map((option, index) => {
        const Icon = OPTION_ICONS[option.value] ?? Sparkles;
        const checked = value === option.value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked || (value === null && index === 0) ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex min-h-16 items-center gap-3 rounded-[var(--mc-radius)] border px-4 py-3 text-left transition-all duration-[var(--mc-dur)] ease-[var(--mc-ease)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mc-accent)]',
              checked
                ? 'border-[var(--mc-accent)] bg-[var(--mc-accent-soft)] shadow-[var(--mc-shadow)]'
                : 'border-[var(--mc-border)] bg-white hover:border-[var(--mc-accent)]/60 hover:bg-[var(--mc-bg-soft)]',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-[var(--mc-dur)]',
                checked
                  ? 'bg-[var(--mc-accent)] text-white'
                  : 'bg-[var(--mc-cream)] text-[var(--mc-ink-soft)]',
              )}
            >
              <Icon className="size-4" />
            </span>
            <span className="text-sm font-medium text-[var(--mc-ink)]">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function GiftFinder({ onView }: { onView: (product: DemoProduct) => void }) {
  const lang = useLangStore((s) => s.lang);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const reset = () => {
    setOccasion(null);
    setRecipient(null);
    setBudget(null);
    setStep(0);
    setShowResults(false);
  };

  const selections = [occasion, recipient, budget];
  const setters = [setOccasion, setRecipient, setBudget];
  // GIFT_FINDER_OPTIONS uses plural keys (occasions/recipients/budgets) while
  // STEP_META uses singular step keys — map explicitly to avoid undefined.
  const values =
    GIFT_FINDER_OPTIONS[
      STEP_META[step].key === 'occasion'
        ? 'occasions'
        : STEP_META[step].key === 'recipient'
          ? 'recipients'
          : 'budgets'
    ];

  const results =
    showResults && occasion && recipient && budget
      ? findGifts(occasion, recipient, budget)
      : null;

  const pick = (value: string) => {
    setters[step](value);
    if (step < 2) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const slide = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
        transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] as const },
      };

  return (
    <div className="mx-auto max-w-4xl">
      <header className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--mc-accent)]">
          {translate(lang, 'nav.finder')}
        </p>
        <h1 className="mt-2 font-heading text-3xl text-[var(--mc-ink)] sm:text-4xl">
          Find a Gift they’ll actually love
        </h1>
        <p className="mx-auto mt-3 max-w-prose text-sm leading-relaxed text-[var(--mc-ink-soft)]">
          Three quick taps. Matching runs on the sample catalogue using the same
          gf-* tag conventions the Shopify theme uses — on the live store it
          searches your real tagged products and only recommends in-stock items.
        </p>
      </header>

      {/* progress */}
      <div className="mt-8 flex items-center justify-center gap-2" aria-hidden="true">
        {STEP_META.map((meta, index) => (
          <span
            key={meta.key}
            className={cn(
              'h-1.5 rounded-full transition-all duration-[var(--mc-dur)]',
              showResults || index <= step
                ? 'w-10 bg-[var(--mc-accent)]'
                : 'w-6 bg-[var(--mc-border)]',
            )}
          />
        ))}
      </div>
      <p aria-live="polite" className="mt-2 text-center text-xs text-[var(--mc-ink-soft)]">
        {showResults
          ? 'Results'
          : `Step ${step + 1} of 3 — ${STEP_META[step].title}`}
      </p>

      <div className="mt-6 rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-white p-4 shadow-[var(--mc-shadow)] sm:p-6">
        <AnimatePresence mode="wait">
          {!results ? (
            <motion.section
              key={`step-${step}`}
              aria-label={STEP_META[step].title}
              {...slide}
            >
              <h2 className="font-heading text-xl text-[var(--mc-ink)]">
                {STEP_META[step].title}
              </h2>
              <p className="mb-4 mt-1 text-sm text-[var(--mc-ink-soft)]">Choose one option.</p>
              <OptionGroup
                label={STEP_META[step].title}
                options={values}
                value={selections[step]}
                onChange={pick}
              />
              <div className="mt-5 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="min-h-11 text-[var(--mc-ink-soft)]"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  {translate(lang, 'action.back')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={reset}
                  className="min-h-11 text-[var(--mc-ink-soft)] hover:text-[var(--mc-ink)]"
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                  {translate(lang, 'action.reset')}
                </Button>
              </div>
            </motion.section>
          ) : (
            <motion.section key="results" aria-label="Gift finder results" {...slide}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p
                  aria-live="polite"
                  className="text-sm font-medium text-[var(--mc-ink)]"
                >
                  {translate(lang, 'finder.resultsCount', { count: results.length })}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={reset}
                  className="min-h-11 border-[var(--mc-border)] text-[var(--mc-ink)] hover:border-[var(--mc-accent)] hover:bg-[var(--mc-accent-soft)]"
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                  Start over
                </Button>
              </div>

              {results.length === 0 ? (
                <div className="flex flex-col items-center rounded-[var(--mc-radius)] border border-dashed border-[var(--mc-border)] bg-[var(--mc-bg-soft)] px-6 py-12 text-center">
                  <SearchX aria-hidden="true" className="size-10 text-[var(--mc-accent)]" />
                  <h3 className="mt-3 font-heading text-xl text-[var(--mc-ink)]">
                    No sample products match this combination
                  </h3>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--mc-ink-soft)]">
                    The sample catalogue is tiny (18 items, only in-stock ones
                    match). On the live store this empty state appears whenever
                    your real tagged catalogue has no in-stock match — the theme
                    shows exactly this friendly reset screen.
                  </p>
                  <Button
                    type="button"
                    onClick={reset}
                    className="mt-5 min-h-11 rounded-full bg-[var(--mc-accent)] px-6 text-white hover:bg-[var(--mc-ink)]"
                  >
                    {translate(lang, 'action.reset')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} onView={onView} />
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {!results && (
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[var(--mc-ink-soft)]">
          <ArrowRight aria-hidden="true" className="size-3.5" />
          Tip: use arrow keys to move between options — the wizard is fully
          keyboard operable.
        </p>
      )}
    </div>
  );
}

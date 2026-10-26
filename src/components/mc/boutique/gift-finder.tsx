'use client';

// Festive Gift Finder — three-tap wizard (occasion → recipient → budget)
// with the reference-exact fallback logic, honest result notes and
// animated step transitions.

import { useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronLeft, Gift, RotateCcw, Signal } from 'lucide-react';
import {
  findGiftIdeas,
  GIFT_STEPS,
  type BoutiqueProduct,
  type GiftChoice,
} from '@/lib/boutique';
import { cn } from '@/lib/utils';
import { ProductCard } from './product-card';
import { Reveal, SECTION_PAD } from './primitives';

type Answers = [GiftChoice | null, GiftChoice | null, GiftChoice | null];

export function GiftFinder({
  products,
  live = null,
}: {
  products: BoutiqueProduct[];
  live?: string | null;
}) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'fwd' | 'back'>('fwd');
  const [answers, setAnswers] = useState<Answers>([null, null, null]);
  const [finished, setFinished] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const results = useMemo(
    () =>
      finished
        ? findGiftIdeas(products, answers[0], answers[1], answers[2])
        : { items: [], note: '' },
    [products, answers, finished],
  );

  const goTo = (next: number) => {
    setDirection(next < step ? 'back' : 'fwd');
    setStep(next);
  };

  const restart = () => {
    setFinished(false);
    setAnswers([null, null, null]);
    goTo(0);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const current = GIFT_STEPS[step];

  return (
    <section
      ref={sectionRef}
      id="gift-finder"
      className={`scroll-mt-24 bg-cream ${SECTION_PAD}`}
      data-testid="gift-finder-section"
      aria-labelledby="gift-finder-title"
    >
      <div className="mx-auto grid w-full max-w-[1360px] items-start gap-8 px-4 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:px-10">
        <Reveal>
          <p className="eyebrow mb-4">Festive gift finder</p>
          <h2
            id="gift-finder-title"
            className="text-[clamp(32px,4.2vw,54px)] leading-[1.06]"
          >
            Find the perfect gift in three taps
          </h2>
          <p className="mt-4 max-w-[44ch] text-ink-2">
            Tell us the occasion, who it&apos;s for and your budget. We&apos;ll suggest in-stock
            gifts from our shelves.
          </p>
          <ol
            className="mt-6 grid grid-flow-col gap-0.5 lg:mt-8 lg:grid-flow-row"
            aria-hidden="true"
          >
            {GIFT_STEPS.map((s, i) => {
              const done = finished || i <= step;
              return (
                <li
                  key={s.key}
                  data-testid={`gift-progress-${i}`}
                  className={cn(
                    'flex flex-col gap-0.5 border-t-2 py-2.5 text-[11px] tracking-[0.08em] uppercase transition-colors duration-300 lg:flex-row lg:items-center lg:gap-3.5 lg:border-t lg:text-[13px]',
                    done ? 'border-gold text-ink lg:border-line' : 'border-line text-ink-2',
                  )}
                >
                  <span
                    className={cn(
                      'font-serif text-lg tracking-normal transition-colors duration-300 lg:w-7',
                      done ? 'text-gold' : 'text-ink-2/50',
                    )}
                  >
                    0{i + 1}
                  </span>
                  {answers[i]?.label ?? s.short}
                </li>
              );
            })}
          </ol>
          <p className="mt-5 hidden max-w-[44ch] text-[12.5px] text-ink-2 lg:block">
            Suggestions come from products currently in stock. Prices are shown as listed in the
            store.
          </p>
          <p
            data-testid="gift-finder-source"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] text-ink-2"
          >
            <Signal className={cn('size-3.5', live ? 'text-ok' : 'text-gold')} />
            {live
              ? `Live products from ${live}`
              : 'Sample data in this preview. The theme uses your real catalogue.'}
          </p>
        </Reveal>

        <div className="relative min-h-[360px] rounded-md border border-line bg-paper p-4 shadow-[0_1px_2px_rgba(32,32,30,.04),0_4px_14px_rgba(32,32,30,.05)] sm:p-8 lg:p-11">
          {finished ? (
            <div className="animate-step" data-testid="gift-results">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow mb-2">Your gift ideas</p>
                  <p
                    className="font-serif text-[22px]"
                    role="status"
                    data-testid="gift-results-status"
                  >
                    {results.items.length
                      ? `${results.items.length} ${results.items.length === 1 ? 'idea' : 'ideas'} · `
                      : ''}
                    {answers.map((a) => a?.label).join(' · ')}
                  </p>
                  {results.note && (
                    <p
                      className="mt-1.5 max-w-[56ch] text-[13px] text-ink-2"
                      data-testid="gift-results-relaxed"
                    >
                      {results.note}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={restart}
                  data-testid="gift-restart-button"
                  className="inline-flex items-center gap-2 border-b border-line pb-1 text-[13px] font-semibold tracking-[0.06em] uppercase transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  Start again
                  <RotateCcw className="size-3.5" />
                </button>
              </div>
              {results.items.length ? (
                <ul
                  className="grid grid-cols-2 gap-x-3 gap-y-6 xl:grid-cols-3"
                  data-testid="gift-results-grid"
                >
                  {results.items.map((p, i) => (
                    <li key={p.id} className="animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
                      <ProductCard p={p} ctx="gift" />
                    </li>
                  ))}
                </ul>
              ) : (
                <div
                  className="grid justify-items-center gap-2.5 px-2 py-7 text-center"
                  data-testid="gift-empty-state"
                >
                  <span className="grid size-16 place-items-center rounded-full bg-blush text-gold">
                    <Gift className="size-7" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-serif text-[26px]">No matching gifts right now</h3>
                  <p className="max-w-[46ch] text-ink-2">
                    Nothing in stock matches these choices at the moment. Try another budget or
                    recipient, or ask us. We&apos;ll gladly help in store or on WhatsApp.
                  </p>
                  <div className="mt-2 flex w-full flex-col justify-center gap-2.5 sm:w-auto sm:flex-row">
                    <button
                      type="button"
                      onClick={restart}
                      data-testid="gift-empty-change-button"
                      className="min-h-12 rounded-[2px] bg-ink px-6 text-[13px] font-semibold tracking-[0.08em] text-warm uppercase transition-colors duration-300 hover:bg-gold"
                    >
                      Change my choices
                    </button>
                    <a
                      href="#trending"
                      data-testid="gift-empty-browse-link"
                      className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-ink px-6 text-[13px] font-semibold tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-ink hover:text-warm"
                    >
                      Browse all products
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <fieldset
              key={step}
              className={cn(
                'min-w-0',
                direction === 'fwd' ? 'animate-step' : 'animate-step-back',
              )}
              data-testid={`gift-step-${current.key}`}
            >
              <legend className="mb-5 grid gap-2 font-serif text-[clamp(24px,2.6vw,32px)] leading-tight">
                <span className="font-sans text-[11px] font-semibold tracking-[0.22em] text-gold">
                  0{step + 1} / 03
                </span>
                {current.q}
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))] sm:gap-2.5">
                {current.choices.map((choice, i) => {
                  const selected = answers[step]?.label === choice.label;
                  return (
                    <label
                      key={choice.label}
                      style={{ animationDelay: `${i * 40}ms` }}
                      data-testid={`gift-choice-${current.key}-${i}`}
                      className={cn(
                        'relative grid min-h-16 animate-rise cursor-pointer gap-1 rounded-sm border py-3.5 pr-9 pl-3 transition-[border-color,background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_4px_14px_rgba(32,32,30,.06)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink sm:min-h-[72px] sm:p-4 sm:pr-11',
                        selected ? 'border-gold bg-blush' : 'border-line bg-paper',
                      )}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        name={current.key}
                        checked={selected}
                        onChange={() => {
                          const next: Answers = [...answers];
                          next[step] = choice;
                          setAnswers(next);
                        }}
                      />
                      <span className="text-[15px] font-semibold">{choice.label}</span>
                      {choice.hint && (
                        <span className="text-[12.5px] text-ink-2">{choice.hint}</span>
                      )}
                      <span
                        className={cn(
                          'absolute top-1/2 right-2.5 grid size-[18px] -translate-y-1/2 place-items-center rounded-full border transition-colors duration-300 sm:right-3.5 sm:size-[22px]',
                          selected ? 'border-gold bg-gold' : 'border-line',
                        )}
                        aria-hidden="true"
                      >
                        <Check
                          className={cn(
                            'size-3 text-white transition-[opacity,scale] duration-300',
                            selected ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
                          )}
                        />
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="sticky bottom-0 mt-5 flex justify-between gap-3 bg-paper pt-3 sm:static sm:mt-7 sm:pt-0">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    data-testid="gift-back-button"
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[2px] border border-ink px-6 text-[13px] font-semibold tracking-[0.08em] uppercase transition-colors duration-300 hover:bg-ink hover:text-warm sm:flex-none"
                  >
                    <ChevronLeft className="size-4" />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  disabled={!answers[step]}
                  data-testid={step === 2 ? 'gift-submit-button' : 'gift-next-button'}
                  onClick={() => {
                    if (step === 2) setFinished(true);
                    else goTo(step + 1);
                  }}
                  className="group ml-auto inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-[2px] border border-ink bg-ink px-7 text-[13px] font-semibold tracking-[0.08em] text-warm uppercase transition-colors duration-300 hover:border-gold hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  {step === 2 ? 'Show gift ideas' : 'Next'}
                  <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-lux)] group-hover:translate-x-1" />
                </button>
              </div>
            </fieldset>
          )}
        </div>
      </div>
    </section>
  );
}

'use client';

// Product page preview — the theme's PDP demonstrated with a sample product:
// gallery with thumbnails, variant pills, stock dot, quantity stepper,
// add-to-bag, and the WhatsApp order button with its honest note and a
// peek at the exact message the shopper sends.

import { useMemo, useState } from 'react';
import { ArrowRight, Info, Minus, Plus } from 'lucide-react';
import {
  buildWhatsAppMessage,
  inr,
  slugify,
  STORE,
  type BoutiqueProduct,
} from '@/lib/boutique';
import { useBoutique } from '@/lib/boutique-store';
import { cn } from '@/lib/utils';
import { SECTION_PAD } from './primitives';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function ProductPagePreview({ p }: { p: BoutiqueProduct }) {
  const { add } = useBoutique();
  const [variant, setVariant] = useState<string | null>(p.variants?.[0] ?? null);
  const [qty, setQty] = useState(1);

  const productUrl = `https://your-store-domain/products/${slugify(p.title)}${
    variant ? `?variant=${slugify(variant)}` : ''
  }`;
  const message = useMemo(
    () => buildWhatsAppMessage(p, variant, qty, productUrl),
    [p, variant, qty, productUrl],
  );

  return (
    <section
      id="product-page"
      className={`scroll-mt-24 bg-paper ${SECTION_PAD}`}
      data-testid="product-page-section"
    >
      <div className="mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <p className="eyebrow mb-6">Product page preview</p>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="grid grid-cols-[1fr_88px] gap-3">
            <div className="aspect-[4/5] overflow-hidden rounded-sm bg-stone">
              <img src={p.image} alt={p.title} loading="lazy" className="size-full object-cover" />
            </div>
            <div className="grid content-start gap-3">
              {[p.image, p.image2].filter(Boolean).map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt=""
                  loading="lazy"
                  className={cn('aspect-[4/5] rounded-sm object-cover', i === 0 && 'ring-1 ring-ink')}
                />
              ))}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-2 uppercase">
              {p.vendor}
            </p>
            <h2
              className="mt-2 text-[clamp(28px,3.2vw,40px)] leading-[1.1]"
              data-testid="pdp-title"
            >
              {p.title}
            </h2>
            <p className="mt-3 text-xl font-semibold tabular-nums" data-testid="pdp-price">
              {inr(p.price)}
            </p>
            <p className="mt-1 text-[13px] text-ink-2">
              Inclusive of all taxes. Shipping calculated at checkout.
            </p>

            {p.variants && (
              <fieldset className="mt-6">
                <legend className="mb-2.5 text-[13px] font-semibold">
                  Size:{' '}
                  <span className="font-normal text-ink-2" data-testid="pdp-selected-variant">
                    {variant}
                  </span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {p.variants.map((option) => (
                    <label
                      key={option}
                      data-testid={`pdp-variant-${slugify(option)}`}
                      className={cn(
                        'inline-flex min-h-[42px] cursor-pointer items-center rounded-[2px] border px-4 text-sm transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink',
                        option === variant
                          ? 'border-ink bg-ink text-warm'
                          : 'border-line hover:border-ink',
                      )}
                    >
                      <input
                        type="radio"
                        name="pdp-variant"
                        className="sr-only"
                        checked={option === variant}
                        onChange={() => setVariant(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <p className="mt-5 flex items-center gap-2 text-sm">
              <span className="size-2 rounded-full bg-ok" />
              In stock
            </p>

            <div className="mt-5 flex gap-2.5">
              <div className="inline-flex items-center rounded-[2px] border border-line">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="grid size-12 place-items-center"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  data-testid="pdp-qty-decrease"
                >
                  <Minus className="size-4" />
                </button>
                <span className="min-w-8 text-center tabular-nums" data-testid="pdp-qty">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="grid size-12 place-items-center"
                  onClick={() => setQty((q) => q + 1)}
                  data-testid="pdp-qty-increase"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  for (let i = 0; i < qty; i += 1) add(p, variant);
                }}
                data-testid="pdp-add-to-bag-button"
                className="group inline-flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-[2px] border border-ink bg-ink text-[13px] font-semibold tracking-[0.08em] text-warm uppercase transition-colors duration-300 hover:border-gold hover:bg-gold"
              >
                Add to bag
                <ArrowRight className="size-[18px] transition-transform duration-300 ease-[var(--ease-lux)] group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-3.5 grid animate-rise gap-2.5">
              <a
                href={`https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="pdp-whatsapp-button"
                aria-describedby="pdp-wa-note"
                className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-[2px] border border-line bg-paper text-[13px] font-semibold tracking-[0.08em] uppercase transition-[border-color,background-color] duration-300 hover:border-[#1F8F55] hover:bg-[#F1F8F3] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#1F8F55]"
              >
                <WhatsAppIcon className="size-[18px] text-[#1F8F55] transition-transform duration-300 ease-[var(--ease-lux)] group-hover:scale-110 group-hover:-rotate-8" />
                Order on WhatsApp
                <span className="sr-only">(opens WhatsApp in a new window)</span>
              </a>
              <p
                id="pdp-wa-note"
                data-testid="pdp-whatsapp-note"
                className="flex gap-2 rounded-r-sm border-l-2 border-gold bg-warm px-3 py-2.5 text-[12.5px] leading-normal text-ink-2"
              >
                <Info className="mt-px size-4 shrink-0 text-gold" />
                WhatsApp orders are confirmed only after we reply with availability and the final
                price. Nothing is charged until you confirm with the store.
              </p>
            </div>

            <details
              className="mt-5 rounded-sm border border-line bg-warm"
              data-testid="pdp-whatsapp-message-preview"
            >
              <summary className="cursor-pointer px-4 py-3 text-[13px] font-semibold">
                Message the shopper sends
              </summary>
              <pre
                className="px-4 pb-4 font-sans text-[13px] whitespace-pre-wrap text-ink-2"
                data-testid="pdp-whatsapp-message"
              >
                {message}
              </pre>
            </details>

            <p className="mt-3 text-[12px] text-ink-2">
              Preview: the store&apos;s number is set in{' '}
              <em>Theme settings → WhatsApp ordering</em>. This preview opens a chat with{' '}
              {STORE.whatsappNumber}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

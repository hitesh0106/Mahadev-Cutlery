'use client';

// Product Demo tab — the theme's product page, faithfully reproduced with
// sample data: gallery, variant pickers with honest disabled states, qty
// stepper, sample description per department, gift-wrap line-item properties,
// WhatsApp ordering (prefilled chat) and add-to-cart into the demo drawer.

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Minus, MessageCircle, Plus, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProductCard } from '@/components/mc/product-card';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { toast } from '@/hooks/use-toast';
import type { DemoProduct } from '@/lib/catalog';
import { useCartStore } from '@/lib/cart-store';
import { formatINR } from '@/lib/format';
import { translate, useLangStore } from '@/lib/i18n';
import { STORE_INFO, whatsappLink } from '@/lib/store-info';
import { cn } from '@/lib/utils';

const GIFT_MESSAGE_MAX = 200;

// Honest, neutral sample copy — clearly marked as a demo description in the UI.
const SAMPLE_DESCRIPTIONS: Record<string, string> = {
  'Beauty & Skincare':
    'A gentle everyday pick from the Beauty & Skincare department. This card demonstrates the product page layout with sample data — the live store will show the owner’s real product description, ingredients and usage notes from the packaging.',
  Makeup:
    'A colour cosmetic sample used to demonstrate the Makeup department pages. The live store shows the owner’s real description, shades and packaging details — nothing here is a claim about a real item.',
  Haircare:
    'A haircare sample card for the Haircare department. On the live store this space carries the owner’s real product text (hair type, size, directions) straight from Shopify.',
  'Hosiery & Innerwear':
    'An innerwear sample used to show size & colour variant pickers. Fabric composition, size charts and care instructions come from the owner’s real product data after the catalogue import.',
  'Kids & Toys':
    'A playful sample card for the Kids & Toys department. Age guidance and safety notes on the live store come from the real product packaging — this demo card only demonstrates layout.',
  'Gift Articles':
    'A gift-article sample card. On the live store, hampers and gift sets appear here with the owner’s real photos, contents and the Gift Finder tags they add.',
  'Imitation Jewellery':
    'An imitation jewellery sample for the Jewellery department. Finish, material and care details on the live store come from the owner’s real catalogue.',
  'Beauty Tools & Grooming':
    'A grooming-tools sample card. The live store shows real brush/tool details, sizes and care notes managed in Shopify.',
  'Accessories & More':
    'A mixed-accessories sample (belts, eyewear, perfumes and similar items live here or under All Products — never in an invented department).',
};

function VariantPicker({
  name,
  options,
  selected,
  onSelect,
  soldOut,
}: {
  name: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
  soldOut: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--mc-ink-soft)]">
        {name}
      </p>
      <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={soldOut}
              onClick={() => onSelect(option)}
              className={cn(
                'min-h-11 rounded-full border px-4 text-sm font-medium transition-all duration-[var(--mc-dur)] ease-[var(--mc-ease)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mc-accent)] disabled:cursor-not-allowed disabled:opacity-40 disabled:line-through',
                active
                  ? 'border-[var(--mc-accent)] bg-[var(--mc-accent)] text-white'
                  : 'border-[var(--mc-border)] bg-white text-[var(--mc-ink)] hover:border-[var(--mc-accent)]',
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ProductDemo({
  product,
  products,
  onProductChange,
}: {
  product: DemoProduct;
  products: DemoProduct[];
  onProductChange: (product: DemoProduct) => void;
}) {
  const lang = useLangStore((s) => s.lang);
  const addItem = useCartStore((s) => s.addItem);
  const { record } = useRecentlyViewed();

  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(product.colors[0] ?? null);
  const [qty, setQty] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Reset selections whenever the selected product changes. Done at render
  // time with a prev-value compare (React's "adjust state when a prop
  // changes" pattern) — no cascading effect needed.
  const [prevProductId, setPrevProductId] = useState(product.id);
  if (prevProductId !== product.id) {
    setPrevProductId(product.id);
    setSize(product.sizes[0] ?? null);
    setColor(product.colors[0] ?? null);
    setQty(1);
    setGiftWrap(false);
    setGiftMessage('');
  }

  // Record the visit (device-local, same localStorage key as the theme).
  useEffect(() => {
    record({
      handle: product.handle,
      title: product.title,
      vendor: product.brand,
      priceInr: product.priceInr,
      image: product.image,
      url: product.url,
    });
  }, [product, record]);

  const related = useMemo(
    () =>
      products
        .filter((p) => p.department === product.department && p.id !== product.id)
        .slice(0, 4),
    [products, product],
  );
  const sameBrand = useMemo(
    () =>
      products
        .filter((p) => p.brand === product.brand && p.id !== product.id)
        .slice(0, 4),
    [products, product],
  );

  const soldOut = !product.available;
  const total = product.priceInr * qty;
  const description = SAMPLE_DESCRIPTIONS[product.department] ?? SAMPLE_DESCRIPTIONS['Accessories & More'];

  const variantLine = [
    size ? `Size: ${size}` : null,
    color ? `Colour: ${color}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const whatsappMessage = [
    `Hello ${STORE_INFO.name},`,
    '',
    'I would like to order:',
    `• ${product.title}${variantLine ? ` (${variantLine})` : ''}`,
    `Quantity: ${qty}`,
    product.url,
    giftWrap ? 'Gift wrap: Yes' : null,
    giftWrap && giftMessage.trim() ? `Gift message: ${giftMessage.trim()}` : null,
    '',
    'Please confirm availability & price.',
  ]
    .filter((line): line is string => line !== null)
    .join('\n');

  const handleAddToCart = () => {
    addItem({
      product,
      size,
      color,
      qty,
      giftWrap: product.giftWrapEligible && giftWrap,
      giftMessage,
    });
    toast({
      title: 'Added to cart (demo)',
      description: `${product.title} — the demo cart never checks out; see the honest note in the drawer.`,
    });
  };

  return (
    <div className="space-y-14">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* ── Gallery ─────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-[var(--mc-grey)] shadow-[var(--mc-shadow)]">
            <Image
              src={product.image}
              alt={`${product.title} — sample image for the ${product.department} department (AI placeholder, not a real product photo)`}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            {!product.available && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <span className="rounded-full bg-[var(--mc-ink)]/85 px-5 py-2 font-heading text-lg text-white">
                  {translate(lang, 'label.soldOut')}
                </span>
              </div>
            )}
          </div>
          <p className="mt-2 text-xs text-[var(--mc-ink-soft)]">
            Sample image — real photos are uploaded by the owner in Shopify.
          </p>
        </div>

        {/* ── Details ─────────────────────────────────────────────── */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--mc-ink-soft)]">
              {product.brand} · {product.department}
            </p>
            <h1 className="mt-2 font-heading text-3xl leading-tight text-[var(--mc-ink)] sm:text-4xl">
              {product.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'border-transparent text-xs font-semibold',
                  product.available
                    ? 'bg-[#287A53]/10 text-[#287A53]'
                    : 'bg-[#B42318]/10 text-[#B42318]',
                )}
              >
                {product.available
                  ? translate(lang, 'label.inStock')
                  : translate(lang, 'label.soldOut')}
              </Badge>
              <Badge
                variant="outline"
                className="border-[var(--mc-border)] bg-[var(--mc-bg-soft)] text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--mc-ink-soft)]"
              >
                {translate(lang, 'label.sample')}
              </Badge>
            </div>
          </div>

          <p className="flex items-baseline gap-2">
            <span className="font-heading text-3xl text-[var(--mc-ink)]">
              {formatINR(product.priceInr)}
            </span>
            <span className="text-sm text-[var(--mc-ink-soft)]">
              {translate(lang, 'label.samplePrice')}
            </span>
          </p>

          {/* Variants */}
          {product.sizes.length > 0 && (
            <VariantPicker
              name="Size"
              options={product.sizes}
              selected={size}
              onSelect={setSize}
              soldOut={soldOut}
            />
          )}
          {product.colors.length > 0 && (
            <VariantPicker
              name="Colour"
              options={product.colors}
              selected={color}
              onSelect={setColor}
              soldOut={soldOut}
            />
          )}
          {!product.available && (
            <p className="text-xs leading-relaxed text-[var(--mc-ink-soft)]">
              Every variant is sold out because this sample product is marked
              unavailable — the sold-out state is genuine demo data, never fake
              scarcity. On the live store, per-variant availability comes from
              Shopify inventory.
            </p>
          )}

          {/* Qty + total */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-[var(--mc-border)] bg-white">
              <button
                type="button"
                aria-label="Decrease quantity (minimum 1)"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="flex size-11 items-center justify-center rounded-l-full text-[var(--mc-ink)] transition-colors duration-[var(--mc-dur)] hover:bg-[var(--mc-grey)] disabled:opacity-40"
              >
                <Minus aria-hidden="true" className="size-4" />
              </button>
              <span
                aria-live="polite"
                aria-label={`Quantity: ${qty}`}
                className="w-10 text-center text-sm font-semibold text-[var(--mc-ink)]"
              >
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity (maximum 10)"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                disabled={qty >= 10}
                className="flex size-11 items-center justify-center rounded-r-full text-[var(--mc-ink)] transition-colors duration-[var(--mc-dur)] hover:bg-[var(--mc-grey)] disabled:opacity-40"
              >
                <Plus aria-hidden="true" className="size-4" />
              </button>
            </div>
            <p className="text-sm text-[var(--mc-ink-soft)]">
              {formatINR(product.priceInr)} × {qty} ={' '}
              <span className="font-heading text-lg text-[var(--mc-ink)]">{formatINR(total)}</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={handleAddToCart}
              disabled={soldOut}
              className="min-h-11 flex-1 rounded-full bg-[var(--mc-accent)] text-white hover:bg-[var(--mc-ink)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag aria-hidden="true" className="size-4" />
              {translate(lang, 'action.addToCart')}
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              className={cn(
                'min-h-11 flex-1 rounded-full border-[#287A53] text-[#287A53] hover:bg-[#287A53]/10 hover:text-[#287A53]',
                soldOut && 'pointer-events-none opacity-50',
              )}
            >
              <a
                href={whatsappLink(whatsappMessage)}
                target="_blank"
                rel="noreferrer noopener"
                aria-disabled={soldOut}
                aria-label={`Order ${product.title} on WhatsApp — opens a chat with the store`}
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                {translate(lang, 'action.whatsapp')}
              </a>
            </Button>
          </div>
          <p className="text-xs leading-relaxed text-[var(--mc-ink-soft)]">
            Opens WhatsApp chat. Stock &amp; price are confirmed by the store in
            chat. Sample prices are for layout demonstration only.
          </p>

          {/* Gift wrap */}
          {product.giftWrapEligible && (
            <div className="rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-[var(--mc-bg-soft)] p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="gift-wrap"
                  checked={giftWrap}
                  onCheckedChange={(checked) => setGiftWrap(checked === true)}
                  disabled={soldOut}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="gift-wrap"
                    className="text-sm font-medium leading-snug text-[var(--mc-ink)]"
                  >
                    Add gift wrapping
                  </Label>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--mc-ink-soft)]">
                    Gift wrapping is complimentary in this demo. In the theme,
                    charged wrapping uses a real “Gift Wrapping” product
                    configured in Shopify — this preview never invents a fee.
                  </p>
                  {giftWrap && (
                    <div className="mt-3">
                      <Label
                        htmlFor="gift-message"
                        className="text-xs font-medium text-[var(--mc-ink-soft)]"
                      >
                        Gift message (optional)
                      </Label>
                      <Textarea
                        id="gift-message"
                        value={giftMessage}
                        maxLength={GIFT_MESSAGE_MAX}
                        onChange={(event) => setGiftMessage(event.target.value)}
                        placeholder="e.g. Happy Diwali! See you soon — Sharma family"
                        className="mc-scroll mt-1.5 min-h-20 border-[var(--mc-border)] bg-white text-sm"
                        aria-describedby="gift-message-counter"
                      />
                      <p
                        id="gift-message-counter"
                        aria-live="polite"
                        className={cn(
                          'mt-1 text-right text-xs',
                          giftMessage.length >= GIFT_MESSAGE_MAX
                            ? 'text-[#B42318]'
                            : 'text-[var(--mc-ink-soft)]',
                        )}
                      >
                        {giftMessage.length}/{GIFT_MESSAGE_MAX}
                      </p>
                    </div>
                  )}
                  <p className="mt-2 text-[11px] leading-relaxed text-[var(--mc-ink-soft)]">
                    Saved to the cart item as line-item properties
                    (“Gift wrap: Yes”, “Gift message: …”) — exactly how the
                    theme does it.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Description + meta */}
          <div className="space-y-3 border-t border-[var(--mc-border)] pt-5">
            <h2 className="font-heading text-xl text-[var(--mc-ink)]">Description</h2>
            <p className="text-sm leading-relaxed text-[var(--mc-ink-soft)]">{description}</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 text-xs text-[var(--mc-ink-soft)] sm:grid-cols-3">
              <div>
                <dt className="font-semibold text-[var(--mc-ink)]">Vendor</dt>
                <dd>{product.brand}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--mc-ink)]">Type</dt>
                <dd>{product.type}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--mc-ink)]">Department</dt>
                <dd>{product.department}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--mc-ink)]">Subcategory</dt>
                <dd>{product.subcategory}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--mc-ink)]">Gift wrap</dt>
                <dd>{product.giftWrapEligible ? 'Eligible (sample)' : 'Not eligible'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[var(--mc-ink)]">Handle</dt>
                <dd className="break-all">{product.handle}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-5 font-heading text-2xl text-[var(--mc-ink)]">
            {translate(lang, 'section.related')}
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onView={onProductChange} />
            ))}
          </div>
        </section>
      )}

      {/* Same brand */}
      {sameBrand.length > 0 && (
        <section aria-labelledby="same-brand-heading">
          <h2 id="same-brand-heading" className="mb-5 font-heading text-2xl text-[var(--mc-ink)]">
            {translate(lang, 'section.sameBrand')}
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {sameBrand.map((p) => (
              <ProductCard key={p.id} product={p} onView={onProductChange} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

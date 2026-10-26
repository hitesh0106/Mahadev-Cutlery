'use client';

// Cart drawer — "Your bag (n)" with line items, quantity steppers, remove
// links, gift-wrap line properties, subtotal and the honest disabled checkout
// (preview-only note). Mirrors the theme's line-item properties behaviour.

import { useEffect } from 'react';
import { ArrowRight, Gift, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { GIFT_WRAP, inr } from '@/lib/boutique';
import { useBoutique } from '@/lib/boutique-store';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { lines, cartOpen, setCartOpen, setQty, count, subtotal, wrappedQty } = useBoutique();
  const { t, tf } = useLang();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCartOpen]);

  const wrapFee =
    GIFT_WRAP.charged && GIFT_WRAP.fee && GIFT_WRAP.fee > 0
      ? GIFT_WRAP.fee * wrappedQty
      : 0;

  return (
    <div
      className={cn('fixed inset-0 z-[95]', cartOpen ? 'visible' : 'invisible')}
      aria-hidden={!cartOpen}
      data-testid="cart-drawer-root"
    >
      <div
        className={cn(
          'absolute inset-0 bg-ink/30 transition-opacity duration-300',
          cartOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={() => setCartOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t('Shopping bag')}
        className={cn(
          'absolute inset-y-0 right-0 flex w-[min(440px,92vw)] flex-col bg-paper transition-transform duration-500 ease-[var(--ease-lux)]',
          cartOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        data-testid="cart-drawer"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-serif text-2xl">
            {t('Your bag')}{' '}
            <span className="font-sans text-sm text-ink-2">({count})</span>
          </h2>
          <button
            type="button"
            aria-label={t('Close bag')}
            onClick={() => setCartOpen(false)}
            className="grid size-10 place-items-center rounded-full hover:bg-stone"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">
          {lines.length === 0 ? (
            <div
              className="grid justify-items-center gap-3 py-16 text-center"
              data-testid="cart-empty-state"
            >
              <span className="grid size-16 place-items-center rounded-full bg-blush text-gold">
                <ShoppingBag className="size-6" strokeWidth={1.5} />
              </span>
              <p className="font-serif text-2xl">{t('Your bag is empty')}</p>
              <p className="text-ink-2">
                {t('Discover skincare, makeup, innerwear and thoughtful gifts.')}
              </p>
            </div>
          ) : (
            <ul className="grid gap-5">
              {lines.map((line, index) => (
                <li
                  key={`${line.product.id}-${line.variant ?? ''}-${line.giftWrap ? 'gw' : ''}`}
                  className="grid grid-cols-[84px_1fr] gap-4"
                  data-testid={`cart-line-${index}`}
                >
                  <img
                    src={line.product.image}
                    alt=""
                    className="aspect-[4/5] w-[84px] rounded-sm object-cover"
                  />
                  <div className="grid content-start gap-1">
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-2 uppercase">
                      {line.product.vendor}
                    </p>
                    <p className="text-[14.5px] leading-snug font-medium">{line.product.title}</p>
                    {line.variant && <p className="text-[13px] text-ink-2">{line.variant}</p>}
                    {line.giftWrap && (
                      <p
                        className="flex items-start gap-1.5 text-[12.5px] text-ink-2"
                        data-testid={`cart-line-giftwrap-${index}`}
                      >
                        <Gift className="mt-px size-3.5 shrink-0 text-gold" strokeWidth={1.5} />
                        <span>
                          {t('Gift wrap')}: {t('Yes')}
                          {line.giftWrap.message && (
                            <>
                              {' · '}
                              {t('Gift message')}: “{line.giftWrap.message}”
                            </>
                          )}
                        </span>
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-sm border border-line">
                        <button
                          type="button"
                          aria-label={t('Decrease quantity')}
                          className="grid size-9 place-items-center"
                          onClick={() => setQty(index, line.qty - 1)}
                          data-testid={`cart-line-decrease-${index}`}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span
                          className="min-w-6 text-center text-sm"
                          data-testid={`cart-line-qty-${index}`}
                        >
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={t('Increase quantity')}
                          className="grid size-9 place-items-center"
                          onClick={() => setQty(index, line.qty + 1)}
                          data-testid={`cart-line-increase-${index}`}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-[14.5px] font-semibold tabular-nums">
                        {inr(line.qty * line.product.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="justify-self-start text-xs text-ink-2 underline underline-offset-[3px]"
                      onClick={() => setQty(index, 0)}
                      data-testid={`cart-line-remove-${index}`}
                    >
                      {t('Remove')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="grid gap-2.5 border-t border-line bg-warm px-6 pt-5 pb-6">
            {wrapFee > 0 && (
              <p
                className="flex justify-between text-[13px] text-ink-2"
                data-testid="cart-giftwrap-fee"
              >
                <span>
                  {t('Wrapping fee')} × {wrappedQty}
                </span>
                <span className="tabular-nums">{inr(wrapFee)}</span>
              </p>
            )}
            <p className="flex justify-between text-[17px] font-semibold">
              <span>{t('Subtotal')}</span>
              <span data-testid="cart-subtotal">{inr(subtotal)}</span>
            </p>
            <p className="text-[13px] text-ink-2">{t('Taxes and shipping are calculated at checkout.')}</p>
            <button
              type="button"
              disabled
              data-testid="cart-checkout-button"
              className="flex min-h-14 items-center justify-center gap-2.5 rounded-[2px] bg-ink text-[13px] font-semibold tracking-[0.08em] text-warm uppercase opacity-90"
              title={t("In the real theme this opens Shopify's native checkout")}
            >
              {t('Checkout')}
              <ArrowRight className="size-4" />
            </button>
            <p className="text-center text-[11.5px] text-ink-2">
              {t('Preview only. On Shopify this button opens native checkout.')}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

'use client';

// Cart drawer — "Your bag (n)" with line items, quantity steppers, remove
// links, subtotal and the honest disabled checkout (preview-only note).

import { useEffect } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { inr } from '@/lib/boutique';
import { useBoutique } from '@/lib/boutique-store';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { lines, cartOpen, setCartOpen, setQty, count, subtotal } = useBoutique();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCartOpen]);

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
        aria-label="Shopping bag"
        className={cn(
          'absolute inset-y-0 right-0 flex w-[min(440px,92vw)] flex-col bg-paper transition-transform duration-500 ease-[var(--ease-lux)]',
          cartOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        data-testid="cart-drawer"
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-serif text-2xl">
            Your bag{' '}
            <span className="font-sans text-sm text-ink-2">({count})</span>
          </h2>
          <button
            type="button"
            aria-label="Close bag"
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
              <p className="font-serif text-2xl">Your bag is empty</p>
              <p className="text-ink-2">
                Discover skincare, makeup, innerwear and thoughtful gifts.
              </p>
            </div>
          ) : (
            <ul className="grid gap-5">
              {lines.map((line, index) => (
                <li
                  key={`${line.product.id}-${line.variant ?? ''}`}
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
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-sm border border-line">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
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
                          aria-label="Increase quantity"
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
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="grid gap-2.5 border-t border-line bg-warm px-6 pt-5 pb-6">
            <p className="flex justify-between text-[17px] font-semibold">
              <span>Subtotal</span>
              <span data-testid="cart-subtotal">{inr(subtotal)}</span>
            </p>
            <p className="text-[13px] text-ink-2">Taxes and shipping are calculated at checkout.</p>
            <button
              type="button"
              disabled
              data-testid="cart-checkout-button"
              className="flex min-h-14 items-center justify-center gap-2.5 rounded-[2px] bg-ink text-[13px] font-semibold tracking-[0.08em] text-warm uppercase opacity-90"
              title="In the real theme this opens Shopify's native checkout"
            >
              Checkout
              <ArrowRight className="size-4" />
            </button>
            <p className="text-center text-[11.5px] text-ink-2">
              Preview only. On Shopify this button opens native checkout.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

'use client';

// Demo cart drawer (Sheet, right). Mirrors the theme's AJAX cart including
// gift-wrap line-item properties. Honest by design: checkout is NOT possible
// in the preview — the button explains that payments only run on the live
// Shopify store after the theme is installed.

import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import {
  selectSubtotal,
  useCartStore,
  type CartLineItem,
} from '@/lib/cart-store';
import { formatINR } from '@/lib/format';
import { translate, useLangStore } from '@/lib/i18n';

function LineItem({ item }: { item: CartLineItem }) {
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <li className="flex gap-3 border-b border-[var(--mc-border)] pb-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-[var(--mc-radius-sm)] bg-[var(--mc-grey)]">
        <Image
          src={item.image}
          alt={`${item.title} — sample product image`}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--mc-ink-soft)]">
          {item.vendor}
        </p>
        <p className="text-sm font-medium leading-snug text-[var(--mc-ink)]">{item.title}</p>
        {(item.size || item.color) && (
          <p className="text-xs text-[var(--mc-ink-soft)]">
            {[item.size && `Size: ${item.size}`, item.color && `Colour: ${item.color}`]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        {item.properties['Gift wrap'] === 'Yes' && (
          <p className="rounded-[var(--mc-radius-sm)] bg-[var(--mc-accent-soft)] px-2 py-1 text-xs text-[var(--mc-ink)]">
            Gift wrap: Yes
            {item.properties['Gift message']
              ? ` · “${item.properties['Gift message']}”`
              : ''}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="inline-flex items-center rounded-full border border-[var(--mc-border)]">
            <button
              type="button"
              aria-label={`Decrease quantity of ${item.title}`}
              onClick={() => setQty(item.key, item.qty - 1)}
              disabled={item.qty <= 1}
              className="flex size-9 items-center justify-center rounded-l-full text-[var(--mc-ink)] hover:bg-[var(--mc-grey)] disabled:opacity-40"
            >
              <Minus aria-hidden="true" className="size-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-semibold">{item.qty}</span>
            <button
              type="button"
              aria-label={`Increase quantity of ${item.title}`}
              onClick={() => setQty(item.key, item.qty + 1)}
              disabled={item.qty >= 10}
              className="flex size-9 items-center justify-center rounded-r-full text-[var(--mc-ink)] hover:bg-[var(--mc-grey)] disabled:opacity-40"
            >
              <Plus aria-hidden="true" className="size-3.5" />
            </button>
          </div>
          <p className="text-sm font-semibold text-[var(--mc-ink)]">
            {formatINR(item.priceInr * item.qty)}
          </p>
          <button
            type="button"
            aria-label={`Remove ${item.title} from cart`}
            onClick={() => removeItem(item.key)}
            className="flex size-9 items-center justify-center rounded-full text-[var(--mc-ink-soft)] transition-colors duration-[var(--mc-dur)] hover:bg-[#B42318]/10 hover:text-[#B42318]"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer({ onBrowse }: { onBrowse: () => void }) {
  const lang = useLangStore((s) => s.lang);
  const { items, drawerOpen, setDrawerOpen, closeDrawer } = useCartStore();
  const subtotal = selectSubtotal(items);

  const onCheckoutClick = () => {
    toast({
      title: 'Checkout is disabled in this preview',
      description:
        'Demo cart — checkout runs on your live Shopify store after the theme is installed. This preview never processes payments.',
    });
  };

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-[var(--mc-border)] pb-4">
          <SheetTitle className="font-heading text-xl text-[var(--mc-ink)]">
            Your Cart
          </SheetTitle>
          <SheetDescription className="sr-only">
            Demo cart — review your sample items. Checkout is not available in
            this preview.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[var(--mc-accent-soft)]">
              <ShoppingBag aria-hidden="true" className="size-6 text-[var(--mc-accent)]" />
            </span>
            <p className="font-heading text-xl text-[var(--mc-ink)]">Your cart is empty</p>
            <p className="max-w-prose text-sm text-[var(--mc-ink-soft)]">
              Browse the sample catalogue and add something — remember this is a
              demo, nothing is ordered.
            </p>
            <Button
              type="button"
              onClick={() => {
                closeDrawer();
                onBrowse();
              }}
              className="mt-2 min-h-11 rounded-full bg-[var(--mc-accent)] px-6 text-white hover:bg-[var(--mc-ink)]"
            >
              {translate(lang, 'action.browse')}
            </Button>
          </div>
        ) : (
          <>
            <ul className="mc-scroll flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => (
                <LineItem key={item.key} item={item} />
              ))}
            </ul>
            <SheetFooter className="mt-0 border-t border-[var(--mc-border)] pt-4">
              <div className="w-full space-y-3">
                <p className="flex items-center justify-between text-sm">
                  <span className="text-[var(--mc-ink-soft)]">Subtotal</span>
                  <span className="font-heading text-xl text-[var(--mc-ink)]">
                    {formatINR(subtotal)}
                  </span>
                </p>
                <p className="rounded-[var(--mc-radius-sm)] bg-[var(--mc-bg-soft)] p-3 text-xs leading-relaxed text-[var(--mc-ink-soft)]">
                  Demo cart — checkout runs on your live Shopify store after
                  the theme is installed. This preview never processes
                  payments. Shipping &amp; taxes are calculated by Shopify on
                  the real store.
                </p>
                <Button
                  type="button"
                  onClick={onCheckoutClick}
                  aria-disabled="true"
                  className="min-h-11 w-full rounded-full bg-[var(--mc-ink)] text-white opacity-60 hover:bg-[var(--mc-ink)] hover:opacity-80"
                >
                  Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

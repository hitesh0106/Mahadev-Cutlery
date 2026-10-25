'use client';

// Wishlist view — device-local saved items (localStorage "mc_wishlist_v1",
// same key as the theme). Includes the honest device-scope note.

import Image from 'next/image';
import { Heart, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useWishlist,
  WISHLIST_DEVICE_NOTE,
} from '@/hooks/use-wishlist';
import type { DemoProduct } from '@/lib/catalog';
import { formatINR } from '@/lib/format';
import { translate, useLangStore } from '@/lib/i18n';

export function WishlistView({
  products,
  onView,
  onBrowse,
}: {
  products: DemoProduct[];
  onView: (product: DemoProduct) => void;
  onBrowse: () => void;
}) {
  const lang = useLangStore((s) => s.lang);
  const { items, ready, remove } = useWishlist();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--mc-accent)]">
          {translate(lang, 'action.wishlist')}
        </p>
        <h1 className="mt-2 font-heading text-3xl text-[var(--mc-ink)] sm:text-4xl">
          Your Wishlist
        </h1>
        <p className="mt-2 max-w-prose text-sm text-[var(--mc-ink-soft)]">
          Saved with the same localStorage key the Shopify theme uses
          (mc_wishlist_v1) — if the theme is installed, this list carries over
          on the same device.
        </p>
      </header>

      <div
        role="note"
        className="flex items-start gap-3 rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-[var(--mc-bg-soft)] p-4"
      >
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--mc-accent)]" />
        <p className="text-xs leading-relaxed text-[var(--mc-ink-soft)]">
          {WISHLIST_DEVICE_NOTE} No account is used and clearing site data
          clears the list — a wishlist app would be needed for cross-device
          sync (documented in the limitations guide).
        </p>
      </div>

      {!ready ? (
        <p className="py-12 text-center text-sm text-[var(--mc-ink-soft)]">Loading…</p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-[var(--mc-radius)] border border-dashed border-[var(--mc-border)] bg-white px-6 py-14 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-[var(--mc-accent-soft)]">
            <Heart aria-hidden="true" className="size-6 text-[var(--mc-accent)]" />
          </span>
          <h2 className="mt-4 font-heading text-xl text-[var(--mc-ink)]">
            Your wishlist is empty
          </h2>
          <p className="mt-2 max-w-prose text-sm text-[var(--mc-ink-soft)]">
            Tap the heart on any sample product to keep it here for later.
          </p>
          <Button
            type="button"
            onClick={onBrowse}
            className="mt-5 min-h-11 rounded-full bg-[var(--mc-accent)] px-6 text-white hover:bg-[var(--mc-ink)]"
          >
            {translate(lang, 'action.browse')}
          </Button>
        </div>
      ) : (
        <div className="mc-scroll max-h-96 overflow-y-auto pr-1">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const product = products.find((p) => p.handle === item.handle);
              return (
                <li
                  key={item.handle}
                  className="flex gap-3 rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-white p-3 shadow-[var(--mc-shadow)]"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-[var(--mc-radius-sm)] bg-[var(--mc-grey)]">
                    <Image
                      src={item.image}
                      alt={`${item.title} — sample product image`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mc-ink-soft)]">
                      {item.vendor}
                    </p>
                    <p className="line-clamp-2 text-sm font-medium leading-snug text-[var(--mc-ink)]">
                      {item.title}
                    </p>
                    <p className="text-xs text-[var(--mc-ink-soft)]">
                      {formatINR(item.priceInr)} · {translate(lang, 'label.samplePrice')}
                    </p>
                    <div className="mt-auto flex items-center gap-2">
                      {product ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onView(product)}
                          className="min-h-9 border-[var(--mc-border)] px-3 text-xs text-[var(--mc-ink)] hover:border-[var(--mc-accent)] hover:bg-[var(--mc-accent-soft)]"
                        >
                          {translate(lang, 'action.view')}
                        </Button>
                      ) : (
                        <span className="text-xs text-[var(--mc-ink-soft)]">
                          Saved from an earlier demo session
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(item.handle)}
                        aria-label={`Remove ${item.title} from wishlist`}
                        className="flex size-9 items-center justify-center rounded-full text-[var(--mc-ink-soft)] transition-colors duration-[var(--mc-dur)] hover:bg-[#B42318]/10 hover:text-[#B42318]"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

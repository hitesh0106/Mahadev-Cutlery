'use client';

// Recently viewed + Wishlist side-by-side section (device-local honesty note).

import { PRODUCTS, type BoutiqueProduct } from '@/lib/boutique';
import { useBoutique } from '@/lib/boutique-store';
import { CONTAINER, SECTION_PAD, SectionHead } from './primitives';
import { ProductCard } from './product-card';

function pickProducts(ids: string[]): BoutiqueProduct[] {
  return ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is BoutiqueProduct => Boolean(p));
}

export function RecentlyWishlist() {
  const { recent, wishlist } = useBoutique();
  const recentProducts = pickProducts(recent);
  const wishlistProducts = pickProducts(wishlist);

  return (
    <section
      id="wishlist"
      className={`${SECTION_PAD} border-t border-line`}
      data-testid="recently-viewed-section"
    >
      <div className={`${CONTAINER} grid gap-12 lg:grid-cols-2`}>
        <div>
          <SectionHead eyebrow="Pick up where you left off" title="Recently viewed" />
          {recentProducts.length ? (
            <ul className="grid grid-cols-2 gap-4">
              {recentProducts.slice(0, 2).map((p) => (
                <li key={p.id}>
                  <ProductCard p={p} ctx="recent" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-2" data-testid="recently-viewed-empty">
              Hover over a few products. In the live theme this list is kept in the shopper&apos;s
              browser only.
            </p>
          )}
        </div>
        <div>
          <SectionHead eyebrow="Saved on this device" title="Wishlist" />
          {wishlistProducts.length ? (
            <ul className="grid grid-cols-2 gap-4" data-testid="wishlist-grid">
              {wishlistProducts.slice(0, 2).map((p) => (
                <li key={p.id}>
                  <ProductCard p={p} ctx="wishlist" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-2" data-testid="wishlist-empty">
              Tap the heart on any product to save it here. It doesn&apos;t sync across devices.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

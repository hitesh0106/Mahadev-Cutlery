'use client';

// Recently viewed + Wishlist side-by-side section (device-local honesty note).

import { PRODUCTS, type BoutiqueProduct } from '@/lib/boutique';
import { useBoutique } from '@/lib/boutique-store';
import { useLang } from '@/lib/i18n';
import { CONTAINER, SECTION_PAD, SectionHead } from './primitives';
import { ProductCard } from './product-card';

function pickProducts(ids: string[]): BoutiqueProduct[] {
  return ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is BoutiqueProduct => Boolean(p));
}

export function RecentlyWishlist() {
  const { recent, wishlist } = useBoutique();
  const { t } = useLang();
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
          <SectionHead eyebrow={t('Pick up where you left off')} title={t('Recently viewed')} />
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
              {t(
                "Hover over a few products. In the live theme this list is kept in the shopper's browser only.",
              )}
            </p>
          )}
        </div>
        <div>
          <SectionHead eyebrow={t('Saved on this device')} title={t('Wishlist')} />
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
              {t("Tap the heart on any product to save it here. It doesn't sync across devices.")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

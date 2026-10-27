'use client';

// Product card used across storefront / gift finder / related rows.
// Honesty: SAMPLE badge always visible, "Sample price" caption, sold-out
// state comes strictly from `available` (no fake scarcity), and the wishlist
// heart is device-local (see use-wishlist).

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DemoProduct } from '@/lib/catalog';
import { formatINR } from '@/lib/format';
import { translate, useLangStore } from '@/lib/i18n';
import { useWishlist } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';

export function ProductCard({
  product,
  onView,
  priority = false,
}: {
  product: DemoProduct;
  onView: (product: DemoProduct) => void;
  priority?: boolean;
}) {
  const lang = useLangStore((s) => s.lang);
  const { has, toggle } = useWishlist();
  const saved = has(product.handle);

  const onToggleWishlist = () => {
    toggle({
      handle: product.handle,
      title: product.title,
      vendor: product.brand,
      priceInr: product.priceInr,
      image: product.image,
      url: product.url,
    });
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--mc-radius)] border border-[var(--mc-border)] bg-white shadow-[var(--mc-shadow)] transition-all duration-[var(--mc-dur)] ease-[var(--mc-ease)] hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-[var(--mc-grey)]">
        <Image
          src={product.image}
          alt={`${product.title} — sample photo for the ${product.department} department (demo placeholder, not a real product photo)`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-[var(--mc-dur)] ease-[var(--mc-ease)] group-hover:scale-[1.03]"
        />

        <Badge
          variant="outline"
          className="absolute left-2 top-2 border-[var(--mc-border)] bg-white/90 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--mc-ink-soft)]"
        >
          {translate(lang, 'label.sample')}
        </Badge>

        <button
          type="button"
          onClick={onToggleWishlist}
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist (saved on this device only)`
          }
          className="absolute right-2 top-2 flex size-10 items-center justify-center rounded-full border border-[var(--mc-border)] bg-white/90 text-[var(--mc-ink-soft)] shadow-sm transition-all duration-[var(--mc-dur)] hover:text-[var(--mc-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mc-accent)]"
        >
          <Heart
            aria-hidden="true"
            className={cn('size-4', saved && 'fill-[var(--mc-accent)] text-[var(--mc-accent)]')}
          />
        </button>

        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-[var(--mc-ink)]/85 px-4 py-1.5 font-heading text-sm tracking-wide text-white">
              {translate(lang, 'label.soldOut')}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--mc-ink-soft)]">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-snug text-[var(--mc-ink)]">
          {product.title}
        </h3>
        <p className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-heading text-lg text-[var(--mc-ink)]">
            {formatINR(product.priceInr)}
          </span>
          <span className="text-[11px] text-[var(--mc-ink-soft)]">
            {translate(lang, 'label.samplePrice')}
          </span>
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onView(product)}
          className="mt-2 w-full min-h-11 border-[var(--mc-border)] text-[var(--mc-ink)] hover:border-[var(--mc-accent)] hover:bg-[var(--mc-accent-soft)] hover:text-[var(--mc-ink)]"
          aria-label={`View ${product.title} in the product demo`}
        >
          {translate(lang, 'action.view')}
        </Button>
      </div>
    </article>
  );
}

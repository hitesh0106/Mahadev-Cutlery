'use client';

// Sticky header: brand lockup, view tabs (client-side only — the showcase is
// a single route), wishlist + cart icons. Collapses into a Sheet menu on
// mobile. Cart/wishlist badges are live (zustand cart / localStorage wishlist).

import { Heart, Menu, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useWishlist } from '@/hooks/use-wishlist';
import { selectCartCount, useCartStore } from '@/lib/cart-store';
import { translate, useLangStore, type UIStringKey } from '@/lib/i18n';
import { STORE_INFO } from '@/lib/store-info';
import { cn } from '@/lib/utils';

export type AppTab =
  | 'storefront'
  | 'finder'
  | 'demo'
  | 'delivery'
  | 'report'
  | 'wishlist';

const TABS: { id: AppTab; labelKey: UIStringKey }[] = [
  { id: 'storefront', labelKey: 'nav.storefront' },
  { id: 'finder', labelKey: 'nav.finder' },
  { id: 'demo', labelKey: 'nav.demo' },
  { id: 'delivery', labelKey: 'nav.delivery' },
  { id: 'report', labelKey: 'nav.report' },
];

function BrandLockup({ onHome }: { onHome: () => void }) {
  return (
    <button
      type="button"
      onClick={onHome}
      aria-label={`${STORE_INFO.name} — go to storefront preview`}
      className="group flex items-center gap-3 rounded-md px-1 py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mc-accent)]"
    >
      <span
        aria-hidden="true"
        className="flex size-10 items-center justify-center rounded-[var(--mc-radius-sm)] bg-[var(--mc-accent)] font-heading text-lg text-white transition-transform duration-[var(--mc-dur)] ease-[var(--mc-ease)] group-hover:scale-105"
      >
        M
      </span>
      <span className="leading-tight">
        <span className="block font-heading text-xl tracking-wide text-[var(--mc-ink)]">
          {STORE_INFO.logoLine1}
        </span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--mc-ink-soft)]">
          {STORE_INFO.logoLine2}
        </span>
      </span>
    </button>
  );
}

export function Header({
  activeTab,
  onTabChange,
}: {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}) {
  const lang = useLangStore((s) => s.lang);
  const cartItems = useCartStore((s) => s.items);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const { items: wishlistItems } = useWishlist();

  const cartCount = selectCartCount(cartItems);
  const wishlistCount = wishlistItems.length;

  const go = (tab: AppTab) => onTabChange(tab);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--mc-border)] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="lg:hidden"
              >
                <Menu aria-hidden="true" className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-heading text-xl text-[var(--mc-ink)]">
                  {STORE_INFO.logoLine1}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Theme studio navigation
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-2 flex flex-col gap-1 px-4">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => go(tab.id)}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                    className={cn(
                      'min-h-11 rounded-[var(--mc-radius-sm)] px-3 text-left text-sm font-medium transition-colors duration-[var(--mc-dur)]',
                      activeTab === tab.id
                        ? 'bg-[var(--mc-accent-soft)] text-[var(--mc-ink)]'
                        : 'text-[var(--mc-ink-soft)] hover:bg-[var(--mc-grey)] hover:text-[var(--mc-ink)]',
                    )}
                  >
                    {translate(lang, tab.labelKey)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => go('wishlist')}
                  aria-current={activeTab === 'wishlist' ? 'page' : undefined}
                  className="min-h-11 rounded-[var(--mc-radius-sm)] px-3 text-left text-sm font-medium text-[var(--mc-ink-soft)] transition-colors duration-[var(--mc-dur)] hover:bg-[var(--mc-grey)] hover:text-[var(--mc-ink)]"
                >
                  {translate(lang, 'action.wishlist')}
                  {wishlistCount > 0 && (
                    <span className="ml-2 rounded-full bg-[var(--mc-accent)] px-1.5 py-0.5 text-[10px] text-white">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </nav>
            </SheetContent>
          </Sheet>

          <BrandLockup onHome={() => go('storefront')} />
        </div>

        {/* Desktop tabs */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => go(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              className={cn(
                'relative min-h-11 rounded-full px-4 text-sm font-medium transition-colors duration-[var(--mc-dur)] ease-[var(--mc-ease)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mc-accent)]',
                activeTab === tab.id
                  ? 'bg-[var(--mc-accent-soft)] text-[var(--mc-ink)]'
                  : 'text-[var(--mc-ink-soft)] hover:bg-[var(--mc-grey)] hover:text-[var(--mc-ink)]',
              )}
            >
              {translate(lang, tab.labelKey)}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} saved)` : ''} — open wishlist`}
            onClick={() => go('wishlist')}
            className="relative"
          >
            <Heart
              aria-hidden="true"
              className={cn(
                'size-5',
                wishlistCount > 0 && 'fill-[var(--mc-accent)] text-[var(--mc-accent)]',
              )}
            />
            {wishlistCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-[var(--mc-accent)] px-1 text-[10px] font-semibold leading-4 text-white"
              >
                {wishlistCount}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ''} — open demo cart`}
            onClick={openDrawer}
            className="relative"
          >
            <ShoppingBag aria-hidden="true" className="size-5" />
            {cartCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-[var(--mc-ink)] px-1 text-[10px] font-semibold leading-4 text-white"
              >
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

'use client';

// Site header — sticky bar, centered logo (xl: logo + nav + mega menu),
// search overlay, wishlist link with badge, bag button with badge and the
// mobile menu drawer. Reference-exact layout and behaviour.

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import {
  ALL_BRANDS,
  img,
  inr,
  MENU_GROUPS,
  NAV_LINKS,
  PRODUCTS,
  type BoutiqueProduct,
} from '@/lib/boutique';
import { useBoutique } from '@/lib/boutique-store';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Logo } from './primitives';
import { LanguageSwitcher } from './language-switcher';

/** Maps each nav label to the closest real section anchor so no nav link is dead. */
const NAV_TARGETS: Record<string, string> = {
  'Shop All': '#departments',
  'Beauty & Skincare': '#skincare-edit',
  Haircare: '#departments',
  Makeup: '#departments',
  'Hosiery & Innerwear': '#innerwear-edit',
  'Kids & Toys': '#gifts-edit',
  'Gifts & Jewellery': '#gifts-edit',
  'Beauty Tools': '#product-types',
  Brands: '#brands-az',
  Offers: '#offers',
};

const MENU_GROUP_TARGETS: Record<string, string> = {
  'Shop by Department': '#departments',
  'Shop by Brand': '#brands-az',
  'Shop by Product Type': '#product-types',
};

// ── Search overlay ───────────────────────────────────────────────────────────

const POPULAR_SEARCHES = ['Face wash', 'Shampoo', 'Lipstick', 'Brief', 'Gift', 'Bangle'];

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, tf } = useLang();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const productHits = useMemo<BoutiqueProduct[]>(
    () => (q ? PRODUCTS.filter((p) => p.title.toLowerCase().includes(q)) : []),
    [q],
  );
  const brandHits = useMemo(
    () =>
      q
        ? ALL_BRANDS.filter((b) => b.toLowerCase().includes(q)).slice(0, 5)
        : [],
    [q],
  );

  return (
    <div
      className={cn('fixed inset-0 z-[90]', open ? 'visible' : 'invisible')}
      aria-hidden={!open}
      data-testid="search-overlay"
    >
      <div
        className={cn(
          'absolute inset-0 bg-ink/30 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('Search the store')}
        className={cn(
          'relative max-h-[88vh] overflow-auto bg-paper transition-[transform,opacity] duration-500 ease-[var(--ease-lux)]',
          open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
        )}
      >
        <div className="mx-auto flex max-w-[980px] items-center gap-3 border-b border-line px-5 py-5">
          <Search className="size-5" strokeWidth={1.5} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('Search products, brands, categories…')}
            data-testid="search-input"
            className="min-w-0 flex-1 bg-transparent py-2 font-serif text-[clamp(18px,2.4vw,26px)] outline-none"
          />
          {query && (
            <button
              type="button"
              className="px-2 text-xs uppercase tracking-widest text-ink-2"
              onClick={() => setQuery('')}
              data-testid="search-clear-button"
            >
              {t('Clear')}
            </button>
          )}
          <button
            type="button"
            aria-label={t('Close search')}
            onClick={onClose}
            data-testid="search-close-button"
            className="grid size-11 place-items-center rounded-full transition-colors hover:bg-stone"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="mx-auto max-w-[980px] px-5 py-6" data-testid="search-results">
          {q ? (
            <div className="grid gap-8 md:grid-cols-[200px_1fr]">
              <div>
                <p className="eyebrow mb-3">{t('Brands')}</p>
                {brandHits.length ? (
                  brandHits.map((brand) => (
                    <p key={brand} className="py-1 text-[15px]">
                      {brand}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-ink-2">{t('No brand match')}</p>
                )}
              </div>
              <div>
                <p className="eyebrow mb-3">{t('Products')}</p>
                {productHits.length ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {productHits.map((p) => (
                      <li
                        key={p.id}
                        data-testid={`search-result-${p.id}`}
                        className="grid grid-cols-[64px_1fr] items-center gap-3.5 rounded-sm p-2 transition-colors hover:bg-warm"
                      >
                        <img
                          src={p.image}
                          alt=""
                          className="aspect-[4/5] w-16 rounded-sm object-cover"
                        />
                        <span>
                          <span className="block text-sm">{p.title}</span>
                          <span className="text-sm font-semibold">{inr(p.price)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ink-2" data-testid="search-empty">
                    {tf(
                      'No products found for “{query}”. Try a brand name like “Lakmé” or a type like “shampoo”.',
                      { query },
                    )}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="eyebrow mb-3">{t('Popular searches')}</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    data-testid={`search-suggestion-${term.toLowerCase().replace(' ', '-')}`}
                    className="rounded-full border border-line px-3.5 py-1.5 text-[13px] transition-colors hover:border-ink"
                  >
                    {t(term)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const { count, setCartOpen, wishlist } = useBoutique();
  const { t, tf } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hoverOpen = (label: string | null) => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(
      () => setOpenMenu(label),
      label ? 60 : 140,
    );
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b bg-paper/[.98] transition-[border-color,box-shadow] duration-300',
          scrolled
            ? 'border-line shadow-[0_6px_24px_rgba(32,32,30,.05)]'
            : 'border-transparent',
        )}
        data-testid="site-header"
      >
        <div
          className={cn(
            'mx-auto grid max-w-[1360px] grid-cols-[44px_1fr_auto] items-center gap-2 px-4 duration-300 sm:px-6 lg:px-10 xl:grid-cols-[auto_1fr_auto] xl:gap-4',
            scrolled ? 'min-h-16' : 'min-h-16 xl:min-h-[76px]',
          )}
        >
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full hover:bg-stone xl:hidden"
            aria-label={t('Open menu')}
            onClick={() => setDrawerOpen(true)}
            data-testid="mobile-menu-button"
          >
            <Menu className="size-[22px]" strokeWidth={1.5} />
          </button>

          <div className="justify-self-center xl:justify-self-start">
            <Logo />
          </div>

          <nav className="hidden justify-center xl:flex" aria-label="Main">
            <ul className="flex flex-nowrap justify-center">
              {NAV_LINKS.map((label) => {
                const isShopAll = label === 'Shop All';
                const isOpen = openMenu === label;
                return (
                  <li
                    key={label}
                    className="flex items-center"
                    onMouseEnter={() => isShopAll && hoverOpen(label)}
                    onMouseLeave={() => isShopAll && hoverOpen(null)}
                  >
                    <a
                      href={NAV_TARGETS[label] ?? '#top'}
                      data-testid={`nav-link-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                      className="group relative inline-block px-[7px] py-[26px] text-[13px] font-medium whitespace-nowrap 2xl:px-2.5 2xl:text-[13.5px]"
                    >
                      {t(label)}
                      <span
                        className={cn(
                          'absolute inset-x-[7px] bottom-[18px] h-px origin-right scale-x-0 bg-gold transition-transform duration-300 ease-[var(--ease-lux)] group-hover:origin-left group-hover:scale-x-100',
                          isOpen && 'origin-left scale-x-100',
                        )}
                      />
                    </a>
                    {isShopAll && (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls="mega-shop-all"
                        aria-label={t('Show Shop All menu')}
                        data-testid="mega-menu-toggle"
                        onClick={() => setOpenMenu(isOpen ? null : label)}
                        onKeyDown={(event) => event.key === 'Escape' && setOpenMenu(null)}
                        className="-ml-1.5 grid h-7 w-[18px] place-items-center opacity-50"
                      >
                        <ChevronDown
                          className={cn(
                            'size-3.5 transition-transform duration-300',
                            isOpen && 'rotate-180',
                          )}
                        />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center">
            <LanguageSwitcher />
            <button
              type="button"
              aria-label={t('Search')}
              onClick={() => setSearchOpen(true)}
              data-testid="header-search-button"
              className="grid size-11 place-items-center rounded-full transition-colors hover:bg-stone"
            >
              <Search className="size-[22px]" strokeWidth={1.5} />
            </button>
            <span
              className="hidden size-11 place-items-center rounded-full hover:bg-stone xl:grid"
              aria-hidden
            >
              <User className="size-[22px]" strokeWidth={1.5} />
            </span>
            <a
              href="#wishlist"
              aria-label={t('Wishlist')}
              data-testid="header-wishlist-link"
              className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-stone"
            >
              <Heart className="size-[22px]" strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span
                  data-testid="wishlist-count"
                  className="absolute top-1 right-0.5 h-[18px] min-w-[18px] rounded-full bg-ink px-1 text-center text-[10px] leading-[18px] font-semibold text-warm"
                >
                  {wishlist.length}
                </span>
              )}
            </a>
            <button
              type="button"
              aria-label={tf('Bag, {count} items', { count })}
              onClick={() => setCartOpen(true)}
              data-testid="header-cart-button"
              className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-stone"
            >
              <ShoppingBag className="size-[22px]" strokeWidth={1.5} />
              {count > 0 && (
                <span
                  key={count}
                  data-testid="cart-count"
                  className="absolute top-1 right-0.5 h-[18px] min-w-[18px] animate-bump rounded-full bg-ink px-1 text-center text-[10px] leading-[18px] font-semibold text-warm"
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega menu (desktop) */}
        <div
          id="mega-shop-all"
          onMouseEnter={() => hoverOpen('Shop All')}
          onMouseLeave={() => hoverOpen(null)}
          data-testid="mega-menu-panel"
          className={cn(
            'absolute inset-x-0 top-full hidden border-t border-line bg-paper shadow-[0_30px_50px_rgba(32,32,30,.08)] transition-[opacity,transform,visibility] duration-300 xl:block',
            openMenu === 'Shop All'
              ? 'visible translate-y-0 opacity-100'
              : 'invisible translate-y-2 opacity-0',
          )}
        >
          <div className="mx-auto grid max-w-[1360px] grid-cols-[1fr_320px] gap-12 px-10 pt-9 pb-11">
            <div className="grid grid-cols-3 gap-8">
              {MENU_GROUPS.map((group) => (
                <div key={group.heading}>
                  <p className="mb-3.5 font-serif text-[19px]">{t(group.heading)}</p>
                  <ul className="grid gap-0.5">
                    {group.links.map((link) => (
                      <li key={link}>
                        <a
                          href={MENU_GROUP_TARGETS[group.heading] ?? '#top'}
                          className="inline-block py-1 text-sm text-ink-2 transition-[color,transform] duration-300 hover:translate-x-[3px] hover:text-ink"
                        >
                          {t(link)}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <a
              href="#skincare-edit"
              className="group grid gap-3.5"
              data-testid="mega-menu-promo"
            >
              <span className="aspect-[3/2] overflow-hidden rounded-sm bg-cream">
                <img
                  src={img('editorial-skincare')}
                  alt=""
                  className="size-full object-cover transition-transform duration-1000 ease-[var(--ease-lux)] group-hover:scale-105"
                />
              </span>
              <span className="eyebrow">{t('The Edit')}</span>
              <span className="-mt-2 font-serif text-[22px]">{t('Everyday skincare essentials')}</span>
            </a>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu drawer */}
      <div
        className={cn('fixed inset-0 z-[90]', drawerOpen ? 'visible' : 'invisible')}
        aria-hidden={!drawerOpen}
        data-testid="mobile-menu-drawer"
      >
        <div
          className={cn(
            'absolute inset-0 bg-ink/30 transition-opacity duration-300',
            drawerOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('Menu')}
          className={cn(
            'absolute inset-y-0 left-0 w-[min(440px,92vw)] overflow-auto bg-paper transition-transform duration-500 ease-[var(--ease-lux)]',
            drawerOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <p className="font-serif text-xl tracking-[0.14em]">MAHADEV</p>
            <div className="flex items-center">
              <LanguageSwitcher />
              <button
                type="button"
                aria-label={t('Close menu')}
                onClick={() => setDrawerOpen(false)}
                className="grid size-10 place-items-center rounded-full hover:bg-stone"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="px-6 py-4">
            <ul>
              {NAV_LINKS.map((label) => (
                <li key={label} className="border-b border-line">
                  {label === 'Shop All' ? (
                    <details className="group">
                      <summary
                        data-testid="mobile-nav-shop-all"
                        className="flex min-h-[52px] cursor-pointer items-center justify-between font-serif text-xl"
                      >
                        {t(label)}
                        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="ml-0.5 border-l border-line pb-3 pl-3.5">
                        {MENU_GROUPS.map((group) => (
                          <details key={group.heading} className="group/sub">
                            <summary className="flex min-h-11 cursor-pointer items-center justify-between text-[15px] text-ink-2">
                              {t(group.heading)}
                              <ChevronDown className="size-4 transition-transform group-open/sub:rotate-180" />
                            </summary>
                            <ul className="pb-2 pl-3">
                              {group.links.map((link) => (
                                <li key={link} className="py-1.5 text-sm text-ink-2">
                                  {t(link)}
                                </li>
                              ))}
                            </ul>
                          </details>
                        ))}
                      </div>
                    </details>
                  ) : (
                    <a
                      href={NAV_TARGETS[label] ?? '#top'}
                      className="flex min-h-[52px] items-center font-serif text-xl"
                      onClick={() => setDrawerOpen(false)}
                    >
                      {t(label)}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

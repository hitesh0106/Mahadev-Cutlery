// Wishlist hook — device-local, keyed "mc_wishlist_v1" (same key & shape as
// the Shopify theme's wishlist.js — SPEC §5).
//
// Honest limitation (documented in the guides): the wishlist is saved in this
// browser's localStorage only. It does NOT sync across devices, requires no
// account, and clears if the customer clears site data.
//
// Implementation note: localStorage is an external store, so the hook uses
// useSyncExternalStore (no setState-inside-effect cascades, SSR-safe).

'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

export type WishlistItem = {
  handle: string;
  title: string;
  vendor: string;
  priceInr: number;
  image: string;
  url: string;
  addedAt: string;
};

export const WISHLIST_STORAGE_KEY = 'mc_wishlist_v1';

export const WISHLIST_DEVICE_NOTE =
  'Saved on this device only — the wishlist is not synced across devices or browsers.';

/** Custom event used to keep hook instances on the SAME page in sync. */
const WISHLIST_EVENT = 'mc:wishlist-changed';

const EMPTY = '[]';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback); // other tabs
  window.addEventListener(WISHLIST_EVENT, callback); // same page
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(WISHLIST_EVENT, callback);
  };
}

/** Raw string snapshot — stable reference while storage is unchanged. */
function getSnapshot(): string {
  return window.localStorage.getItem(WISHLIST_STORAGE_KEY) ?? EMPTY;
}

function getServerSnapshot(): string {
  return EMPTY;
}

function parseItems(raw: string): WishlistItem[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is WishlistItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as WishlistItem).handle === 'string',
    );
  } catch {
    return [];
  }
}

function readStorage(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  return parseItems(getSnapshot());
}

function writeStorage(items: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full / blocked — the demo stays usable, the list just won't persist.
  }
  window.dispatchEvent(new CustomEvent(WISHLIST_EVENT));
}

/** True only after hydration — lets components render stable SSR markup. */
function useReady(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

export function useWishlist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = useMemo(() => parseItems(raw), [raw]);
  const ready = useReady();

  const has = useCallback(
    (handle: string) => items.some((item) => item.handle === handle),
    [items],
  );

  const add = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    const current = readStorage();
    if (current.some((existing) => existing.handle === item.handle)) return;
    writeStorage([...current, { ...item, addedAt: new Date().toISOString() }]);
  }, []);

  const remove = useCallback((handle: string) => {
    writeStorage(readStorage().filter((item) => item.handle !== handle));
  }, []);

  const toggle = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    const current = readStorage();
    if (current.some((existing) => existing.handle === item.handle)) {
      writeStorage(current.filter((existing) => existing.handle !== item.handle));
      return false;
    }
    writeStorage([...current, { ...item, addedAt: new Date().toISOString() }]);
    return true;
  }, []);

  const clear = useCallback(() => writeStorage([]), []);

  return { items, ready, has, add, remove, toggle, clear };
}

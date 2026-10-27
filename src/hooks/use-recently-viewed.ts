// Recently-viewed hook — device-local, keyed "mc_recently_viewed_v1"
// (same key & shape as the Shopify theme — SPEC §5). Max 12 entries; the
// current product can be excluded when displaying the strip.
//
// Implementation note: localStorage is an external store, so the hook uses
// useSyncExternalStore (no setState-inside-effect cascades, SSR-safe).

'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { WishlistItem } from '@/hooks/use-wishlist';

export const RECENTLY_VIEWED_STORAGE_KEY = 'mc_recently_viewed_v1';
const MAX_ITEMS = 12;

const RECENTLY_VIEWED_EVENT = 'mc:recently-viewed-changed';

const EMPTY = '[]';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(RECENTLY_VIEWED_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(RECENTLY_VIEWED_EVENT, callback);
  };
}

function getSnapshot(): string {
  return window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY) ?? EMPTY;
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
    window.localStorage.setItem(
      RECENTLY_VIEWED_STORAGE_KEY,
      JSON.stringify(items.slice(0, MAX_ITEMS)),
    );
  } catch {
    // Storage full / blocked — ignore, feature is device-local decoration.
  }
  window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_EVENT));
}

export function useRecentlyViewed(excludeHandle?: string) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const stored = useMemo(() => parseItems(raw), [raw]);

  const ready = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const items = useMemo(
    () => stored.filter((item) => item.handle !== excludeHandle),
    [stored, excludeHandle],
  );

  /** Adds/moves a product to the front of the list (deduped, capped at 12). */
  const record = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    const current = readStorage().filter((existing) => existing.handle !== item.handle);
    writeStorage([{ ...item, addedAt: new Date().toISOString() }, ...current]);
  }, []);

  return { items, ready, record };
}

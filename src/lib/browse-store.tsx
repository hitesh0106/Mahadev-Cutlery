'use client';

// Browse store — in-page navigation state for brand / department / product-type
// collection views (the preview is a single route by design, so "pages" are a
// state-driven view swap, exactly like the cart drawer or search overlay).
//
// Uses the same SSR-safe external-store pattern as the language + wishlist
// stores: module snapshot cached, useSyncExternalStore for readers, window
// event for cross-component sync. Scroll position is saved when the first
// collection view opens and restored when the shopper goes back home.

import { useSyncExternalStore } from 'react';

export type BrowseTarget =
  | { kind: 'brand'; name: string }
  | { kind: 'department'; name: string }
  | { kind: 'type'; name: string };

type Listener = () => void;
const listeners = new Set<Listener>();
const BROWSE_EVENT = 'mahadev-preview:browse-changed';

let browseCache: BrowseTarget | null = null;
let savedScrollY = 0;

function getBrowseSnapshot(): BrowseTarget | null {
  return browseCache;
}

function getServerBrowse(): BrowseTarget | null {
  return null;
}

function subscribeBrowse(listener: Listener) {
  listeners.add(listener);
  window.addEventListener(BROWSE_EVENT, listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener(BROWSE_EVENT, listener);
  };
}

function emit() {
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new Event(BROWSE_EVENT));
}

/** Opens a collection view (first open remembers the current scroll). */
export function openBrowse(target: BrowseTarget) {
  if (!browseCache) savedScrollY = window.scrollY;
  browseCache = { ...target };
  emit();
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
}

/** Closes the collection view and restores where the shopper was. */
export function closeBrowse() {
  if (!browseCache) return;
  browseCache = null;
  emit();
  requestAnimationFrame(() => {
    window.scrollTo({ top: savedScrollY, behavior: 'auto' });
    savedScrollY = 0;
  });
}

export function useBrowse() {
  const browse = useSyncExternalStore(
    subscribeBrowse,
    getBrowseSnapshot,
    getServerBrowse,
  );
  return { browse, openBrowse, closeBrowse };
}

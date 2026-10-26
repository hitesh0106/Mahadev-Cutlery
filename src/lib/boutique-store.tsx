'use client';

// Boutique preview store — cart lines, device-local wishlist and recently
// viewed products, mirroring the approved reference behaviour.
// Wishlist lives ONLY in this browser (localStorage key kept identical to the
// reference) and intentionally does not sync across devices.
// The wishlist is an external store read via useSyncExternalStore so hydration
// stays SSR-safe without setState-in-effect.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { GIFT_WRAP, type BoutiqueProduct } from '@/lib/boutique';

const WISHLIST_KEY = 'mahadev-preview:wishlist';
const WISHLIST_EVENT = 'mahadev-preview:wishlist-changed';

// ── External wishlist store (localStorage-backed) ────────────────────────────

type Listener = () => void;
const listeners = new Set<Listener>();
let wishlistCache: string[] | null = null;

function readWishlist(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function getWishlistSnapshot(): string[] {
  if (wishlistCache === null) wishlistCache = readWishlist();
  return wishlistCache;
}

const EMPTY_WISHLIST: string[] = [];

function getServerWishlist(): string[] {
  return EMPTY_WISHLIST;
}

function subscribeWishlist(listener: Listener) {
  listeners.add(listener);
  const onChanged = () => listener();
  window.addEventListener(WISHLIST_EVENT, onChanged);
  window.addEventListener('storage', onChanged);
  return () => {
    listeners.delete(listener);
    window.removeEventListener(WISHLIST_EVENT, onChanged);
    window.removeEventListener('storage', onChanged);
  };
}

function writeWishlist(next: string[]) {
  wishlistCache = next;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode) — wishlist stays session-only.
  }
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new Event(WISHLIST_EVENT));
}

function useWishlistIds(): string[] {
  return useSyncExternalStore(subscribeWishlist, getWishlistSnapshot, getServerWishlist);
}

// ── Context (cart + recent) ──────────────────────────────────────────────────

export type CartLine = {
  product: BoutiqueProduct;
  variant: string | null;
  qty: number;
  /** Present when the shopper added gift wrapping (line-item property). */
  giftWrap?: { message: string };
};

type BoutiqueStore = {
  lines: CartLine[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  add: (
    product: BoutiqueProduct,
    variant?: string | null,
    giftWrap?: { message?: string },
  ) => void;
  setQty: (index: number, qty: number) => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
  recent: string[];
  view: (id: string) => void;
  count: number;
  subtotal: number;
  /** Qty of gift-wrapped items (drives the charged-mode fee, as theme.js does). */
  wrappedQty: number;
};

const StoreContext = createContext<BoutiqueStore | null>(null);

export function BoutiqueProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const wishlist = useWishlistIds();

  const add = useCallback(
    (
      product: BoutiqueProduct,
      variant: string | null = null,
      giftWrap?: { message?: string },
    ) => {
      const wrap = giftWrap
        ? { message: giftWrap.message?.trim().slice(0, GIFT_WRAP.maxMessage) ?? '' }
        : undefined;
      setLines((prev) => {
        const index = prev.findIndex(
          (line) =>
            line.product.id === product.id &&
            line.variant === variant &&
            line.giftWrap?.message === wrap?.message,
        );
        if (index >= 0) {
          return prev.map((line, i) =>
            i === index ? { ...line, qty: line.qty + 1 } : line,
          );
        }
        return [...prev, { product, variant, qty: 1, giftWrap: wrap }];
      });
      setCartOpen(true);
    },
    [],
  );

  const setQty = useCallback((index: number, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((_, i) => i !== index);
      return prev.map((line, i) => (i === index ? { ...line, qty } : line));
    });
  }, []);

  const toggleWish = useCallback((id: string) => {
    const current = getWishlistSnapshot();
    const has = current.includes(id);
    toast(has ? 'Removed from wishlist' : 'Saved to wishlist on this device');
    writeWishlist(
      has
        ? current.filter((saved) => saved !== id)
        : [id, ...current.filter((saved) => saved !== id)],
    );
  }, []);

  const view = useCallback((id: string) => {
    setRecent((prev) => (prev[0] === id ? prev : [id, ...prev.filter((seen) => seen !== id)].slice(0, 4)));
  }, []);

  const value = useMemo<BoutiqueStore>(() => {
    const wrappedQty = lines.reduce(
      (sum, line) => sum + (line.giftWrap ? line.qty : 0),
      0,
    );
    // Charged mode mirrors theme.js syncGiftWrap: the real "Gift Wrapping"
    // product's actual price is added per wrapped item. With charged=false
    // (default) or no configured fee, NOTHING is added — never invented.
    const wrapFee =
      GIFT_WRAP.charged && GIFT_WRAP.fee && GIFT_WRAP.fee > 0
        ? GIFT_WRAP.fee * wrappedQty
        : 0;
    return {
      lines,
      cartOpen,
      setCartOpen,
      add,
      setQty,
      wishlist,
      toggleWish,
      recent,
      view,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal:
        lines.reduce((sum, line) => sum + line.qty * line.product.price, 0) +
        wrapFee,
      wrappedQty,
    };
  }, [lines, cartOpen, add, setQty, wishlist, toggleWish, recent, view]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useBoutique() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useBoutique outside BoutiqueProvider');
  return store;
}

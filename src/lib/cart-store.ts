// Demo cart store (zustand) for the showcase preview.
//
// This is NOT a real checkout: the preview never processes payments.
// Line items mirror the theme's AJAX cart shape, including the gift-wrap
// line item properties concept ("Gift wrap" = "Yes", "Gift message" = text)
// that the Shopify theme sets on real cart items.

import { create } from 'zustand';
import type { DemoProduct } from '@/lib/catalog';

export type CartProperties = {
  'Gift wrap'?: 'Yes';
  'Gift message'?: string;
};

export type CartLineItem = {
  /** Stable line key: handle + selected options + gift-wrap flag. */
  key: string;
  handle: string;
  title: string;
  vendor: string;
  priceInr: number;
  image: string;
  size: string | null;
  color: string | null;
  qty: number;
  properties: CartProperties;
};

export type AddToCartInput = {
  product: DemoProduct;
  size: string | null;
  color: string | null;
  qty: number;
  giftWrap: boolean;
  giftMessage: string;
};

type CartState = {
  items: CartLineItem[];
  drawerOpen: boolean;
  addItem: (input: AddToCartInput) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
};

function lineKey(
  handle: string,
  size: string | null,
  color: string | null,
  giftWrap: boolean,
): string {
  return [handle, size ?? '-', color ?? '-', giftWrap ? 'wrap' : 'nowrap'].join('__');
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  drawerOpen: false,
  addItem: ({ product, size, color, qty, giftWrap, giftMessage }) =>
    set((state) => {
      const key = lineKey(product.handle, size, color, giftWrap);
      const properties: CartProperties = giftWrap
        ? {
            'Gift wrap': 'Yes',
            ...(giftMessage.trim() ? { 'Gift message': giftMessage.trim() } : {}),
          }
        : {};
      const existing = state.items.find((item) => item.key === key);
      const items = existing
        ? state.items.map((item) =>
            item.key === key
              ? { ...item, qty: Math.min(10, item.qty + qty), properties }
              : item,
          )
        : [
            ...state.items,
            {
              key,
              handle: product.handle,
              title: product.title,
              vendor: product.brand,
              priceInr: product.priceInr,
              image: product.image,
              size,
              color,
              qty,
              properties,
            },
          ];
      return { items, drawerOpen: true };
    }),
  removeItem: (key) =>
    set((state) => ({ items: state.items.filter((item) => item.key !== key) })),
  setQty: (key, qty) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.key === key ? { ...item, qty: Math.max(1, Math.min(10, qty)) } : item,
      ),
    })),
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
}));

/** Computed subtotal (INR, sample prices only). */
export function selectSubtotal(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.priceInr * item.qty, 0);
}

export function selectCartCount(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

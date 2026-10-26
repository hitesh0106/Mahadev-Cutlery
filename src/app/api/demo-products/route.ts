// GET /api/demo-products — serves the SAMPLE catalogue for the showcase app.
// Contract (SPEC §6): every item is explicitly demo data and is excluded from
// the production catalogue; the real catalogue lives in Shopify after the
// owner imports products.

import { NextResponse } from 'next/server';
import {
  BRAND_RULES,
  DEPARTMENTS,
  DEMO_PRODUCTS,
  GIFT_FINDER_OPTIONS,
} from '@/lib/catalog';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    products: DEMO_PRODUCTS,
    departments: DEPARTMENTS,
    brandRules: BRAND_RULES,
    giftFinder: GIFT_FINDER_OPTIONS,
  });
}

// GET /api/demo-products — serves the SAMPLE catalogue for the showcase app.
// Contract: every item is explicitly demo data ("Sample brand" vendor) and is
// excluded from the production catalogue; the real catalogue lives in Shopify
// after the owner imports products (see /api/products-csv + guides).

import { NextResponse } from 'next/server';
import { ALL_BRANDS, DEPARTMENTS, PRODUCTS } from '@/lib/boutique';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    products: PRODUCTS,
    brands: ALL_BRANDS,
    departments: DEPARTMENTS,
    source: 'sample',
    note: 'Sample data for the theme preview only — not real store products.',
  });
}

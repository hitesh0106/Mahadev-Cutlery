// GET /api/products-csv — downloadable Shopify product-import CSV template.
//
// Honesty rules (SPEC §0/§7):
// - All data rows are clearly marked examples (title suffix + tags prefix),
//   Published=FALSE + Status=draft, and must be deleted before a real import.
// - Image Src is left EMPTY — image URLs are never invented.
// - Compare-at price is left empty — no invented discounts.

import { DEMO_PRODUCTS } from '@/lib/catalog';

export const runtime = 'nodejs';

// Canonical Shopify product import columns (order matters for Shopify).
const COLUMNS = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Product Category',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Option2 Name',
  'Option2 Value',
  'Option3 Name',
  'Option3 Value',
  'Variant SKU',
  'Variant Inventory Tracker',
  'Variant Inventory Qty',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
  'Variant Compare At Price',
  'Variant Requires Shipping',
  'Variant Taxable',
  'Image Src',
  'Image Position',
  'Image Alt Text',
  'Gift Card',
  'SEO Title',
  'SEO Description',
  'Status',
] as const;

type Column = (typeof COLUMNS)[number];
type Row = Partial<Record<Column, string>>;

const EXAMPLE_TAG = 'EXAMPLE-DELETE-BEFORE-IMPORT';
const EXAMPLE_TITLE_SUFFIX = ' — EXAMPLE — DELETE BEFORE IMPORT';

function csvCell(value: string | number | undefined | null): string {
  const s = value === undefined || value === null ? '' : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function rowFrom(record: Row): string[] {
  return COLUMNS.map((column) => record[column] ?? '');
}

function seoTitle(productTitle: string): string {
  return productTitle.replace(' — SAMPLE', '').slice(0, 70);
}

function buildRows(): string[][] {
  const zoiro = DEMO_PRODUCTS.find((p) => p.id === 'mc-001');
  const lotus = DEMO_PRODUCTS.find((p) => p.id === 'mc-007');
  const hamper = DEMO_PRODUCTS.find((p) => p.id === 'mc-012');
  const rows: string[][] = [[...COLUMNS]];

  if (zoiro) {
    // Two Size variants (S + M) and a Colour option — one row per variant;
    // the second variant row repeats only Handle + option values + variant fields.
    const base: Row = {
      Handle: zoiro.handle,
      Title: `${zoiro.title}${EXAMPLE_TITLE_SUFFIX}`,
      'Body (HTML)':
        '<p>Sample description for the import template — replace with the real product details before importing.</p>',
      Vendor: zoiro.brand,
      'Product Category': 'Apparel & Accessories > Clothing > Underwear & Socks',
      Type: zoiro.type,
      Tags: [EXAMPLE_TAG, ...zoiro.tags].join(','),
      Published: 'FALSE',
      'Option1 Name': 'Size',
      'Option2 Name': 'Colour',
      'Variant Inventory Tracker': 'shopify',
      'Variant Inventory Policy': 'deny',
      'Variant Fulfillment Service': 'manual',
      'Variant Price': zoiro.priceInr.toFixed(2),
      'Variant Requires Shipping': 'TRUE',
      'Variant Taxable': 'TRUE',
      'Image Position': '1',
      'Image Alt Text': "Zoiro men's cotton nikar vest — replace with a real product photo",
      'Gift Card': 'FALSE',
      'SEO Title': seoTitle(zoiro.title),
      'SEO Description':
        'Sample SEO description for the template. Replace with your own honest text.',
      Status: 'draft',
    };
    rows.push(
      rowFrom({
        ...base,
        'Option1 Value': zoiro.sizes[0] ?? 'S',
        'Option2 Value': zoiro.colors[0] ?? 'White',
        'Variant SKU': 'EXAMPLE-MC001-S',
        'Variant Inventory Qty': '10',
      }),
      rowFrom({
        ...base,
        Title: '',
        'Body (HTML)': '',
        'Product Category': '',
        Tags: '',
        Published: '',
        // Canonical format: option NAMES only on the first row of a product.
        'Option1 Name': '',
        'Option2 Name': '',
        'Image Position': '',
        'Image Alt Text': '',
        'Gift Card': '',
        'SEO Title': '',
        'SEO Description': '',
        Status: '',
        'Option1 Value': zoiro.sizes[1] ?? 'M',
        'Option2 Value': zoiro.colors[1] ?? 'Grey',
        'Variant SKU': 'EXAMPLE-MC001-M',
        'Variant Inventory Qty': '8',
      }),
    );
  }

  if (lotus) {
    // Single-variant product: option names/values stay empty.
    rows.push(
      rowFrom({
        Handle: lotus.handle,
        Title: `${lotus.title}${EXAMPLE_TITLE_SUFFIX}`,
        'Body (HTML)':
          '<p>Sample description for the import template — replace with the real product details before importing.</p>',
        Vendor: lotus.brand,
        'Product Category':
          'Health & Beauty > Personal Care > Cosmetics > Skin Care > Cleanser',
        Type: lotus.type,
        Tags: [EXAMPLE_TAG, ...lotus.tags].join(','),
        Published: 'FALSE',
        'Variant SKU': 'EXAMPLE-MC007-DEFAULT',
        'Variant Inventory Tracker': 'shopify',
        'Variant Inventory Qty': '15',
        'Variant Inventory Policy': 'deny',
        'Variant Fulfillment Service': 'manual',
        'Variant Price': lotus.priceInr.toFixed(2),
        'Variant Requires Shipping': 'TRUE',
        'Variant Taxable': 'TRUE',
        'Image Position': '1',
        'Image Alt Text':
          'Lotus Herbals gentle face wash — replace with a real product photo',
        'Gift Card': 'FALSE',
        'SEO Title': seoTitle(lotus.title),
        'SEO Description':
          'Sample SEO description for the template. Replace with your own honest text.',
        Status: 'draft',
      }),
    );
  }

  if (hamper) {
    // Gift product with gift-finder tags; Product Category left empty on purpose
    // (Shopify can auto-categorize — never guessed here).
    rows.push(
      rowFrom({
        Handle: hamper.handle,
        Title: `${hamper.title}${EXAMPLE_TITLE_SUFFIX}`,
        'Body (HTML)':
          '<p>Sample description for the import template — replace with the real product details before importing.</p>',
        Vendor: hamper.brand,
        'Product Category': '',
        Type: hamper.type,
        Tags: [EXAMPLE_TAG, ...hamper.tags, ...hamper.gfTags].join(','),
        Published: 'FALSE',
        'Variant SKU': 'EXAMPLE-MC012-DEFAULT',
        'Variant Inventory Tracker': 'shopify',
        'Variant Inventory Qty': '5',
        'Variant Inventory Policy': 'deny',
        'Variant Fulfillment Service': 'manual',
        'Variant Price': hamper.priceInr.toFixed(2),
        'Variant Requires Shipping': 'TRUE',
        'Variant Taxable': 'TRUE',
        'Image Position': '1',
        'Image Alt Text':
          'Decorative gift hamper set — replace with a real product photo',
        'Gift Card': 'FALSE',
        'SEO Title': seoTitle(hamper.title),
        'SEO Description':
          'Sample SEO description for the template. Replace with your own honest text.',
        Status: 'draft',
      }),
    );
  }

  return rows;
}

export function GET() {
  const rows = buildRows();
  // CRLF line endings + UTF-8 BOM so Excel opens ₹/accents correctly and
  // Shopify imports the file cleanly.
  const csv = '\uFEFF' + rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition':
        'attachment; filename="mahadev-products-import-template.csv"',
      'Cache-Control': 'no-store',
    },
  });
}

// GET /api/products-xlsx — downloadable Excel product-import template
// (built with exceljs). Honesty rules (SPEC §0/§7):
// - The 3 example products (4 rows) are clearly marked and filled light amber.
// - Image Src is left EMPTY — image URLs are never invented.
// - The Reference sheet carries the real brand/department rules and honest
//   notes ("Never invent image URLs / prices / stock", "No kitchenware
//   department exists").
// - A hidden "Lists" sheet feeds the Vendor/Type dropdown validation.

import { createRequire } from 'node:module';

// exceljs is CommonJS; under Turbopack externals the default import is not
// callable, so resolve it through Node's own require.
const requireCjs = createRequire(import.meta.url);
const ExcelJS = requireCjs('exceljs') as typeof import('exceljs');
import {
  BRAND_RULES,
  DEPARTMENTS,
  DEMO_PRODUCTS,
} from '@/lib/catalog';

export const runtime = 'nodejs';

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
];

// Brands allowed in the Vendor dropdown — SPEC §3 (rules brands + other known
// brands). Merchants may extend this list in the hidden "Lists" sheet.
const VENDOR_LIST: string[] = [
  ...BRAND_RULES.map((b) => b.brand),
  'Jockey',
  'Van Heusen',
  'Matrix',
  'Wella Professionals',
  'Garnier',
  'Minimalist',
  'O3+',
  'Cetaphil',
  'Sebamed',
  'Pilgrim',
  'Plix',
  'NIVEA',
  "POND'S",
  'Dot & Key',
  'Swiss Beauty',
  'Lakmé',
  'MARS',
  'Maybelline New York',
  'Colorbar',
  'Faces Canada',
  'VEGA',
  'Philips',
];

const TYPE_LIST: string[] = [...new Set(DEMO_PRODUCTS.map((p) => p.type))].sort();

const GIFT_TAGS: { tag: string; meaning: string }[] = [
  { tag: 'gf-oc-diwali', meaning: 'Occasion — Diwali' },
  { tag: 'gf-oc-rakhi', meaning: 'Occasion — Raksha Bandhan' },
  { tag: 'gf-oc-birthday', meaning: 'Occasion — Birthday' },
  { tag: 'gf-oc-anniversary', meaning: 'Occasion — Anniversary' },
  { tag: 'gf-oc-wedding', meaning: 'Occasion — Wedding' },
  { tag: 'gf-for-her', meaning: 'Recipient — For Her' },
  { tag: 'gf-for-him', meaning: 'Recipient — For Him' },
  { tag: 'gf-for-kids', meaning: 'Recipient — For Kids' },
  { tag: 'gf-for-couple', meaning: 'Recipient — For a Couple' },
  { tag: 'gf-for-family', meaning: 'Recipient — For Family' },
  { tag: 'gf-under-199', meaning: 'Budget — Under ₹199' },
  { tag: 'gf-199-499', meaning: 'Budget — ₹199 to ₹499' },
  { tag: 'gf-500-999', meaning: 'Budget — ₹500 to ₹999' },
  { tag: 'gf-1000-plus', meaning: 'Budget — ₹1000 & above' },
];

type ExampleRow = (string | null)[];

function exampleRows(): ExampleRow[] {
  const EXAMPLE_TAG = 'EXAMPLE-DELETE-BEFORE-IMPORT';
  const SUFFIX = ' — EXAMPLE — DELETE BEFORE IMPORT';
  const BODY = '<p>Sample description for the import template — replace with the real product details before importing.</p>';
  const SEO = 'Sample SEO description for the template. Replace with your own honest text.';

  const zoiro = DEMO_PRODUCTS.find((p) => p.id === 'mc-001');
  const lotus = DEMO_PRODUCTS.find((p) => p.id === 'mc-007');
  const hamper = DEMO_PRODUCTS.find((p) => p.id === 'mc-012');
  const rows: ExampleRow[] = [];

  if (zoiro) {
    rows.push(
      [
        zoiro.handle,
        `${zoiro.title}${SUFFIX}`,
        BODY,
        zoiro.brand,
        'Apparel & Accessories > Clothing > Underwear & Socks',
        zoiro.type,
        [EXAMPLE_TAG, ...zoiro.tags].join(','),
        'TRUE',
        'Size',
        zoiro.sizes[0] ?? 'S',
        'Colour',
        zoiro.colors[0] ?? 'White',
        null,
        null,
        'EXAMPLE-MC001-S',
        'shopify',
        '10',
        'deny',
        'manual',
        zoiro.priceInr.toFixed(2),
        null,
        'TRUE',
        'TRUE',
        null, // Image Src — never invent URLs
        '1',
        "Zoiro men's cotton nikar vest — replace with a real product photo",
        'FALSE',
        zoiro.title.replace(' — SAMPLE', ''),
        SEO,
        'active',
      ],
      [
        zoiro.handle,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        zoiro.sizes[1] ?? 'M',
        null,
        zoiro.colors[1] ?? 'Grey',
        null,
        null,
        'EXAMPLE-MC001-M',
        'shopify',
        '8',
        'deny',
        'manual',
        zoiro.priceInr.toFixed(2),
        null,
        'TRUE',
        'TRUE',
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ],
    );
  }

  if (lotus) {
    rows.push([
      lotus.handle,
      `${lotus.title}${SUFFIX}`,
      BODY,
      lotus.brand,
      'Health & Beauty > Personal Care > Cosmetics > Skin Care > Cleanser',
      lotus.type,
      [EXAMPLE_TAG, ...lotus.tags].join(','),
      'TRUE',
      null,
      null,
      null,
      null,
      null,
      null,
      'EXAMPLE-MC007-DEFAULT',
      'shopify',
      '15',
      'deny',
      'manual',
      lotus.priceInr.toFixed(2),
      null,
      'TRUE',
      'TRUE',
      null,
      '1',
      'Lotus Herbals gentle face wash — replace with a real product photo',
      'FALSE',
      lotus.title.replace(' — SAMPLE', ''),
      SEO,
      'active',
    ]);
  }

  if (hamper) {
    rows.push([
      hamper.handle,
      `${hamper.title}${SUFFIX}`,
      BODY,
      hamper.brand,
      null,
      hamper.type,
      [EXAMPLE_TAG, ...hamper.tags, ...hamper.gfTags].join(','),
      'TRUE',
      null,
      null,
      null,
      null,
      null,
      null,
      'EXAMPLE-MC012-DEFAULT',
      'shopify',
      '5',
      'deny',
      'manual',
      hamper.priceInr.toFixed(2),
      null,
      'TRUE',
      'TRUE',
      null,
      '1',
      'Decorative gift hamper set — replace with a real product photo',
      'FALSE',
      hamper.title.replace(' — SAMPLE', ''),
      SEO,
      'active',
    ]);
  }

  return rows;
}

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFB8875A' },
};
const BANNER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFEAD1B6' },
};
const EXAMPLE_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFF9F1E6' },
};

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = HEADER_FILL;
    cell.alignment = { vertical: 'middle', wrapText: true };
  });
  row.height = 22;
}

function applyListValidation(
  sheet: ExcelJS.Worksheet,
  columnLetter: string,
  formula: string,
  message: string,
  firstRow = 3,
  lastRow = 202,
) {
  for (let r = firstRow; r <= lastRow; r++) {
    sheet.getCell(`${columnLetter}${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [formula],
      showErrorMessage: true,
      errorTitle: 'Value not in list',
      error: message,
    };
  }
}

export async function GET() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'MAHADEV CUTLERY & GIFT ARTICLES — theme studio';
  workbook.created = new Date();

  // ── Sheet 1: Import ──────────────────────────────────────────────────────
  const importSheet = workbook.addWorksheet('Import', {
    views: [{ state: 'frozen', ySplit: 2 }],
  });

  importSheet.mergeCells(1, 1, 1, COLUMNS.length);
  const banner = importSheet.getCell('A1');
  banner.value =
    'EXAMPLE ROWS — DELETE BEFORE IMPORT — replace these rows with your real products, then delete this banner row too, save the sheet as CSV and import it in Shopify (Products → Import).';
  banner.font = { bold: true, color: { argb: 'FF20201E' } };
  banner.fill = BANNER_FILL;
  banner.alignment = { vertical: 'middle', wrapText: true };
  importSheet.getRow(1).height = 30;

  const headerRow = importSheet.getRow(2);
  headerRow.values = COLUMNS;
  styleHeaderRow(headerRow);

  const rows = exampleRows();
  rows.forEach((data, index) => {
    const rowNumber = 3 + index;
    const row = importSheet.getRow(rowNumber);
    COLUMNS.forEach((_, colIndex) => {
      const value = data[colIndex];
      const cell = row.getCell(colIndex + 1);
      cell.value = value === null || value === undefined ? '' : value;
      cell.fill = EXAMPLE_FILL;
      cell.alignment = { vertical: 'top', wrapText: true };
    });
  });

  // Column widths (readability, not critical for import).
  const widths = [
    30, 44, 44, 20, 42, 18, 42, 11, 13, 13, 13, 13, 13, 13, 22, 14, 10, 12, 14,
    13, 14, 14, 11, 30, 9, 40, 11, 36, 42, 12,
  ];
  widths.forEach((width, index) => {
    importSheet.getColumn(index + 1).width = width;
  });

  // Dropdown validation: Vendor + Type from the hidden Lists sheet,
  // Published / Status as inline lists.
  applyListValidation(
    importSheet,
    'D',
    `Lists!$A$2:$A$${VENDOR_LIST.length + 1}`,
    'Pick a Vendor from the allowed brand list (see the Lists / Reference sheets).',
  );
  applyListValidation(
    importSheet,
    'F',
    `Lists!$C$2:$C$${TYPE_LIST.length + 1}`,
    'Pick a Product Type from the allowed list (or extend the list on the hidden Lists sheet).',
  );
  applyListValidation(importSheet, 'H', '"TRUE,FALSE"', 'Published must be TRUE or FALSE.');
  applyListValidation(importSheet, 'AD', '"active,draft,archived"', 'Status must be active, draft or archived.');

  // ── Sheet 2 (hidden): Lists ──────────────────────────────────────────────
  const listsSheet = workbook.addWorksheet('Lists');
  listsSheet.state = 'hidden';
  listsSheet.getRow(1).values = [
    'Vendor (Brand)',
    'Department (guidance — see Reference sheet)',
    'Product Type',
    'Gift-finder tag',
  ];
  styleHeaderRow(listsSheet.getRow(1));

  const listColumnLengths = [
    VENDOR_LIST.length,
    DEPARTMENTS.length,
    TYPE_LIST.length,
    GIFT_TAGS.length,
  ];
  for (let r = 0; r < Math.max(...listColumnLengths); r++) {
    const row = listsSheet.getRow(r + 2);
    if (VENDOR_LIST[r] !== undefined) row.getCell(1).value = VENDOR_LIST[r];
    if (DEPARTMENTS[r] !== undefined) {
      row.getCell(2).value = DEPARTMENTS[r].name;
    }
    if (TYPE_LIST[r] !== undefined) row.getCell(3).value = TYPE_LIST[r];
    if (GIFT_TAGS[r] !== undefined) {
      row.getCell(4).value = `${GIFT_TAGS[r].tag} — ${GIFT_TAGS[r].meaning}`;
    }
  }
  listsSheet.getColumn(1).width = 26;
  listsSheet.getColumn(2).width = 40;
  listsSheet.getColumn(3).width = 22;
  listsSheet.getColumn(4).width = 34;

  // ── Sheet 3: Reference ───────────────────────────────────────────────────
  const ref = workbook.addWorksheet('Reference');
  ref.getColumn(1).width = 30;
  ref.getColumn(2).width = 72;
  ref.getColumn(3).width = 40;

  const title = ref.getCell('A1');
  title.value =
    'MAHADEV CUTLERY & GIFT ARTICLES — Product Import Reference (template with SAMPLE rows only)';
  title.font = { bold: true, size: 14 };
  ref.mergeCells('A1:C1');
  ref.getRow(1).height = 24;

  let r = 3;
  const sectionHeader = (text: string) => {
    const cell = ref.getCell(`A${r}`);
    cell.value = text;
    cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    cell.fill = HEADER_FILL;
    ref.mergeCells(`A${r}:C${r}`);
    r += 1;
  };
  const twoColTable = (headers: [string, string], rowsData: [string, string][]) => {
    headers.forEach((h, i) => {
      const cell = ref.getCell(r, i + 1);
      cell.value = h;
      cell.font = { bold: true };
      cell.fill = EXAMPLE_FILL;
    });
    r += 1;
    for (const [a, b] of rowsData) {
      ref.getCell(`A${r}`).value = a;
      ref.getCell(`B${r}`).value = b;
      ref.getCell(`A${r}`).alignment = { vertical: 'top', wrapText: true };
      ref.getCell(`B${r}`).alignment = { vertical: 'top', wrapText: true };
      r += 1;
    }
  };
  const note = (text: string) => {
    const cell = ref.getCell(`A${r}`);
    cell.value = text;
    cell.alignment = { vertical: 'top', wrapText: true };
    ref.mergeCells(`A${r}:C${r}`);
    r += 1;
  };

  sectionHeader('Brand rules (enforced everywhere — showcase, theme, docs)');
  twoColTable(
    ['Brand (Vendor)', 'Rule'],
    BRAND_RULES.map((b) => [b.brand, b.rule]),
  );
  note(
    'Other known brands (no special rule): Jockey, Van Heusen, Matrix, Wella Professionals, Garnier, Minimalist, O3+, Cetaphil, Sebamed, Pilgrim, Plix, NIVEA, POND\'S, Dot & Key, Swiss Beauty, Lakmé, MARS, Maybelline New York, Colorbar, Faces Canada, VEGA, Philips. Never auto-generate brand collections for brands whose stock is unconfirmed.',
  );

  r += 1;
  sectionHeader('Departments — the ONLY ones (no kitchenware/cutlery exists)');
  twoColTable(
    ['Department', 'Focus'],
    DEPARTMENTS.map((d) => [d.name, d.blurb]),
  );
  note(
    'There is NO kitchenware/cutlery department — the store name includes "Cutlery", but the online taxonomy intentionally does not. Belts, goggles, perfumes and other mixed items belong to Accessories & More (or All Products).',
  );

  r += 1;
  sectionHeader('Product types used in the sample catalogue (extend as needed)');
  note(TYPE_LIST.join(', '));

  r += 1;
  sectionHeader('Gift-finder tags (add these to Tags so products appear in the Gift Finder)');
  twoColTable(
    ['Tag', 'Meaning'],
    GIFT_TAGS.map((t) => [t.tag, t.meaning]),
  );

  r += 1;
  sectionHeader('Honest notes — read before importing');
  note('• Never invent image URLs / prices / stock. Image Src is left empty in the examples — upload real photos in Shopify Admin or paste your own real URLs.');
  note('• No kitchenware department exists (see above).');
  note('• Compare-at price only if there is a GENUINE before-price — never invent discounts.');
  note('• Product Category is optional (Shopify standard taxonomy). Leave it empty to let Shopify auto-categorize.');
  note('• The example rows (light amber) must be DELETED before a real import.');
  note('• Variant Inventory Tracker = shopify, Policy = deny, Fulfillment Service = manual for a standard setup.');
  note('• Wishlist, recently viewed and gift finder work from YOUR real imported products and tags — the theme never fabricates data.');

  const buffer = (await workbook.xlsx.writeBuffer()) as unknown as ArrayBuffer;

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="mahadev-products-import-template.xlsx"',
      'Cache-Control': 'no-store',
    },
  });
}

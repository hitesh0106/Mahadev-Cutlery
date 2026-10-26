// Verification report data — statuses are HONEST: 'passed' | 'failed' | 'not_performed'
// Updated after the Agent-Browser verification round (2026-10-25).
// NEVER set 'passed' without real evidence collected in this environment.

export type CheckStatus = 'passed' | 'failed' | 'not_performed';

export type CheckRow = {
  area: string;
  item: string;
  status: CheckStatus;
  detail: string;
};

export const REPORT_META = {
  project: 'MAHADEV CUTLERY & GIFT ARTICLES — Shopify theme + showcase app',
  updated:
    'Verified 25 Oct 2026 via custom theme validator + Agent-Browser end-to-end session. Failed checks were fixed and re-verified in the same session.',
  legend: {
    passed: 'Verified working in this environment',
    failed: 'Attempted, found broken — fixed and re-verified',
    not_performed: 'Cannot be verified here (needs Shopify admin / credentials / external service)',
  },
};

export const REPORT_ROWS: CheckRow[] = [
  {
    area: 'Shopify theme (shopify-theme/)',
    item: 'Complete structure: assets, config, layout, locales, sections (16), snippets (10), templates (11)',
    status: 'passed',
    detail: 'All folders authored; ZIP route packs 52 theme files with only the 7 theme folders at root.',
  },
  {
    area: 'Shopify theme (shopify-theme/)',
    item: 'JSON validity (settings, locales, templates, {% schema %} blocks) + Liquid tag balance + locale-key coverage',
    status: 'passed',
    detail: 'Custom validator (scripts/validate-theme.ts): every .json parses; every "| t" key exists in en.default.json; hi/gu share the same tree; if/unless/for/case/capture/form/paginate/schema balanced; templates reference existing sections; assets/snippets resolve.',
  },
  {
    area: 'Shopify theme (shopify-theme/)',
    item: 'Official Shopify theme-check CLI validation',
    status: 'not_performed',
    detail: 'Theme-check / Shopify CLI unavailable in this sandbox. Covered instead by the custom validator above; recommend running `shopify theme check` after upload.',
  },
  {
    area: 'Shopify theme (shopify-theme/)',
    item: 'Rendering inside a real Shopify store (product/collection/search templates with live data)',
    status: 'not_performed',
    detail: 'Requires a development store. Upload the ZIP, preview before publishing (see Install guide).',
  },
  {
    area: 'Showcase app',
    item: 'Home / storefront preview renders (desktop + mobile), scroll reveals, department grid, featured products',
    status: 'passed',
    detail: 'Agent-Browser: 1280px and 390px viewports render correctly; no console errors; sticky footer with safe-area padding.',
  },
  {
    area: 'Showcase app',
    item: 'Gift Finder 3-step flow + results + graceful empty state',
    status: 'passed',
    detail: 'Full walk-through: Diwali→For Her→₹199–₹499 returned the 3 correct tagged products; Diwali→For Kids→Under ₹199 showed the honest empty state. A real bug (undefined option group) was found, fixed and re-verified.',
  },
  {
    area: 'Showcase app',
    item: 'Product demo: variants, qty stepper, gift wrap + message (line-item properties), WhatsApp deep link, add to cart',
    status: 'passed',
    detail: 'Verified: size/colour selection updates the WhatsApp message (variant + qty) and cart line; gift wrap only on eligible products; message stored as "Gift wrap: Yes" / "Gift message: …"; ₹570 subtotal for 2×₹285.',
  },
  {
    area: 'Showcase app',
    item: 'Demo cart drawer: add, qty change, remove, subtotal, honest no-checkout note',
    status: 'passed',
    detail: 'Drawer shows line-item properties, qty steppers and the note that checkout runs on the live Shopify store — the preview never processes payments.',
  },
  {
    area: 'Showcase app',
    item: 'Wishlist + Recently viewed (localStorage mc_wishlist_v1 / mc_recently_viewed_v1)',
    status: 'passed',
    detail: 'Hearts toggle, header badge updates reactively, wishlist view renders with device-local note, recently-viewed strip records product views. Device-local only (no cross-device sync) — documented in guides.',
  },
  {
    area: 'Showcase app',
    item: 'Festival countdown — Diwali 2026-11-08 Asia/Kolkata ticking + past festival auto-hide',
    status: 'passed',
    detail: 'Live tick verified (13d 03:41:58 remaining from 25 Oct 2026 — correct IST math); config marks Raksha Bandhan 2026-08-28 passed → inactive until owner sets the next date.',
  },
  {
    area: 'Showcase app',
    item: 'Interface language switch EN / हिंदी / ગુજરાતી with honest scope note',
    status: 'passed',
    detail: 'Nav, buttons and headings translate; brand/product names untouched; tooltip states that full-store translation needs Shopify Languages + Translate & Adapt.',
  },
  {
    area: 'Delivery artifacts',
    item: 'Theme ZIP download (API + real browser download)',
    status: 'passed',
    detail: 'GET /api/theme-zip → 200; ZIP contains ONLY assets/config/layout/locales/sections/snippets/templates (SPEC.md excluded); browser download saved mahadev-theme.zip and the UI confirms it.',
  },
  {
    area: 'Delivery artifacts',
    item: 'Shopify CSV import template',
    status: 'passed',
    detail: 'Canonical Shopify columns; 3 EXAMPLE rows prefixed "EXAMPLE — DELETE BEFORE IMPORT"; image URLs left empty on purpose.',
  },
  {
    area: 'Delivery artifacts',
    item: 'XLSX import template (dropdown validation + Reference sheet)',
    status: 'passed',
    detail: 'Valid Excel 2007+ workbook (verified with curl download); Import sheet with styled headers + example rows, hidden Lists sheet for Vendor/Type validation, Reference sheet with brand rules and honest notes.',
  },
  {
    area: 'Delivery artifacts',
    item: '13 AI-generated placeholder images (hero, 9 departments, gift wrapping, gift finder)',
    status: 'passed',
    detail: 'All files generated and served from /images with descriptive alt text and "AI placeholder" captions.',
  },
  {
    area: 'Code quality',
    item: 'ESLint clean',
    status: 'passed',
    detail: 'bun run lint passes with 0 errors / 0 warnings after fixes (useSyncExternalStore for localStorage hooks; render-time state reset in product demo).',
  },
  {
    area: 'Requires Shopify admin (by design, never embedded here)',
    item: 'Store connection, real product import, checkout & payments',
    status: 'not_performed',
    detail: 'Needs the owner’s dev store + credentials. Import flow: bulk spreadsheet → Products → Import (see Beginner Product guide). No claim of imported/connected state is made.',
  },
  {
    area: 'Requires Shopify admin',
    item: 'Publishing Hindi/Gujarati languages + Translate & Adapt',
    status: 'not_performed',
    detail: 'Theme ships locale files; store-level languages and translations are configured in Settings → Languages (documented in the Languages guide).',
  },
  {
    area: 'Requires external integration',
    item: 'WhatsApp order completion (real chat with the store)',
    status: 'not_performed',
    detail: 'Deep links verified correct (wa.me/919898648776 with prefilled product, variant, qty, link and confirm-availability note); an actual order must be confirmed manually by the store in chat.',
  },
];

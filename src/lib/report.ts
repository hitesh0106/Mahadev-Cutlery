// Verification report data — statuses are HONEST: 'passed' | 'failed' | 'not_performed'
// Updated after the reference-copy rebuild + Agent-Browser verification round (2026-10-26).
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
    'Verified 26 Oct 2026 (two rounds). Round 1: 1:1 reference-copy rebuild, re-verified end-to-end with Agent-Browser (desktop 1440px + mobile 390px). Round 2: official 8-department catalogue taxonomy (30 brand profiles, collection architecture, import templates, docs) implemented + validated (scripts/validate-catalog.ts, 45 checks); festival countdown, gift wrap and the EN/हिन्दी/ગુજરાતી switcher are now demonstrated in the preview; a real Gift Finder crash (missing tags array) was found on mobile and fixed.',
  legend: {
    passed: 'Verified working in this environment',
    failed: 'Attempted, found broken — fixed and re-verified',
    not_performed: 'Cannot be verified here (needs Shopify admin / credentials / external service)',
  },
};

export const REPORT_ROWS: CheckRow[] = [
  {
    area: 'Reference design copy (preview page)',
    item: 'Section order & content match the approved reference walkthrough frame-by-frame',
    status: 'passed',
    detail:
      'Notice bar → announcement carousel → header (mega menu) → hero → Shop by department → Featured brands → Trending → Product page preview → New arrivals → Shop by product type → 3 edit stories → Gift Finder → Shop by budget → Genuine savings → Recently viewed + Wishlist → Brands A–Z → Newsletter → footer. Copy, prices and data identical to the reference source.',
  },
  {
    area: 'Reference design copy (preview page)',
    item: 'Design tokens match the reference (Playfair Display + Inter, ink #20201e, gold #b8875a, warm/cream/blush backgrounds, ease-lux motion, reveal animations)',
    status: 'passed',
    detail:
      'Fonts loaded via next/font (Playfair Display + Inter); palette registered as Tailwind tokens and verified in rendered screenshots (hero, departments, trending, brands A–Z, gift finder, footer).',
  },
  {
    area: 'Reference design copy (preview page)',
    item: 'Header: sticky shrink, Shop All mega menu, search overlay, wishlist & bag badges, mobile drawer with nested Shop All',
    status: 'passed',
    detail:
      'Agent-Browser: mega panel opens on hover/toggle with 3 groups + promo card; search finds "shampoo" → 1 product and honest "No brand match"; badges react live; mobile drawer (390px) expands nested groups.',
  },
  {
    area: 'Catalogue taxonomy (8 departments, 30 brands)',
    item: 'Eight approved departments applied everywhere: Beauty & Makeup, Skincare, Haircare, Hosiery & Innerwear, Toys & Kids, Gift Articles, Imitation Jewellery, Accessories & Grooming — no kitchenware/cutlery department',
    status: 'passed',
    detail:
      'validate-catalog.ts: preview grid, mega menu, main nav (Shop All + 8 + Brands), footer, XLSX reference sheet, theme editor info strings and collection seeds all match; kitchenware scanner passes across data/code/docs.',
  },
  {
    area: 'Catalogue taxonomy (8 departments, 30 brands)',
    item: '30 brand profiles with hard restrictions (Zoiro men-only; Bodycare women/kids only; Lady Care women-only; Lotus Herbals never auto-makeup; L\'Oréal Paris ≠ Professionnel; Sunny stock-gated; Ghar Soaps identity-gated)',
    status: 'passed',
    detail:
      'data/brand-department-map.csv + docs/BRAND_DEPARTMENT_MAP.md + src/lib/taxonomy.ts kept in sync; validator asserts every prohibition text and verification status (rule-verified / stock-verification-required / identity-unverified).',
  },
  {
    area: 'Catalogue taxonomy (8 departments, 30 brands)',
    item: 'Canonical vendor spellings; no duplicates or variants (fixed: "MARS"→"MARS Cosmetics", curly L\'Oréal apostrophes normalized)',
    status: 'passed',
    detail:
      'Validator duplicate + spelling scan passes for all 30 vendors incl. O3+; brand directory brands ⊆ canonical vendor list.',
  },
  {
    area: 'Catalogue taxonomy (8 departments, 30 brands)',
    item: 'Tag conventions department_/audience_/type_/brand_ (+ gf-* Gift Finder tags) in sample data and templates',
    status: 'passed',
    detail:
      'All 18 sample products re-tagged; validator checks every tag prefix; XLSX Reference sheet gained the tag-conventions table; Vendor dropdown now lists the 30 canonical vendors.',
  },
  {
    area: 'Delivery artifacts (taxonomy round)',
    item: 'data/brand-department-map.csv, data/department-collection-seed.csv, data/product-import-template.csv + docs (BRAND_DEPARTMENT_MAP / PRODUCT_TAXONOMY / PRODUCT_IMPORT / TESTING_REPORT)',
    status: 'passed',
    detail:
      'All files created and validated (45 validator checks). Import-template example rows are Published=FALSE + Status=draft so an accidental import cannot reach the storefront. New CSVs downloadable in-app (Delivery view) via /api/catalog-csv.',
  },
  {
    area: 'Delivery artifacts (taxonomy round)',
    item: 'Previous theme backup preserved',
    status: 'passed',
    detail: 'backups/shopify-theme-pre-taxonomy-20261026/ — full copy of shopify-theme/ taken before any taxonomy edits.',
  },
  {
    area: 'Festival countdown banner',
    item: 'Diwali countdown (2026-11-08, Asia/Kolkata): live ticker, Gift-Finder CTA, honest auto-hide (Raksha Bandhan passed → hidden; ended-state note; window-over → removed)',
    status: 'passed',
    detail:
      'Browser: ticker ticks in real time (06→04 s), correct days/hours for IST; unit checks in bun: during-window → honest "ended" note, after window → banner absent. Theme section + countdown.js unchanged (structurally validated); owner re-verifies dates yearly (documented).',
  },
  {
    area: 'Gift wrap (preview demonstration)',
    item: 'PDP gift-wrap checkbox + message (≤200 chars, live counter), cart line-item properties, WhatsApp message includes wrap + message',
    status: 'passed',
    detail:
      'Browser: counter shows 165 characters left after a 35-char message; cart line shows "Gift wrap: Yes · Gift message: …"; WhatsApp preview contains both lines; subtotal unchanged in free mode.',
  },
  {
    area: 'Gift wrap (charged mode)',
    item: 'Charged gift wrap adds the REAL "Gift Wrapping" product price to the cart/order',
    status: 'not_performed',
    detail:
      'Implemented in theme.js (syncGiftWrap adds the configured product per wrapped item) and mirrored in the preview store; the preview never invents a fee (charged=false default). Verifying a real charge needs the owner\'s Gift Wrapping product + a connected store.',
  },
  {
    area: 'Languages (EN / हिन्दी / ગુજરાતી)',
    item: 'Language switcher in the preview: nav, buttons, headings, cart messages, gift-finder, footer translated; brand names, product titles and prices preserved; <html lang> + localStorage persistence',
    status: 'passed',
    detail:
      'Browser: हिन्दी and ગુજરાતી render across chrome; "Jockey" stays Latin; documentElement.lang = hi/gu; choice survives reload. Store-level translation (Translate & Adapt) documented in the Languages guide — not performable here.',
  },
  {
    area: 'Bugs found by browser verification (this round)',
    item: 'Gift Finder crashed when a product without a tags array matched the selected budget (mobile walk: Birthday + Kids + ₹300–699)',
    status: 'failed',
    detail:
      'Root cause: p.tags.map on undefined (product p5 had no tags). Fixed: seed default tags: [] + defensive (p.tags ?? []) in findGiftIdeas + recipient-him tag for p5. Re-verified: honest empty state AND results grid both render (2 ideas · Diwali · For the family · ₹700–₹1,499).',
  },
  {
    area: 'Bugs found by browser verification (this round)',
    item: '4px horizontal overflow on mobile (390px) caused by the added language switcher',
    status: 'failed',
    detail:
      'Fixed with a compact mobile switcher (icon-only, tighter padding); scrollWidth = 390 = innerWidth re-verified.',
  },
  {
    area: 'Shopify theme (shopify-theme/)',
    item: 'Complete structure: assets, config, layout, locales, sections (16), snippets (10), templates (11)',
    status: 'passed',
    detail: 'All folders authored; ZIP route packs 52 theme files with only the 7 theme folders at root. Pre-taxonomy backup: backups/shopify-theme-pre-taxonomy-20261026/.',
  },
  {
    area: 'Shopify theme (shopify-theme/)',
    item: 'JSON validity (settings, locales, templates, {% schema %} blocks) + Liquid tag balance + locale-key coverage',
    status: 'passed',
    detail: 'Custom validator (scripts/validate-theme.ts): every .json parses; every "| t" key exists in en.default.json; hi/gu share the same tree; tags balanced; templates reference existing sections; assets/snippets resolve.',
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
    area: 'Showcase app (boutique preview)',
    item: 'One-page preview renders on desktop (1440px) and mobile (390px) with scroll reveals, no console errors, no horizontal overflow',
    status: 'passed',
    detail: 'Agent-Browser: hero, departments (8 cards), trending carousel, edit stories (18 chips), offers, budget cards render; scrollHeight ~12k desktop / 16.6k mobile; scrollWidth == innerWidth on mobile.',
  },
  {
    area: 'Showcase app (boutique preview)',
    item: 'Product cards: hover image swap, SOLD OUT state (no quick add), % OFF badge with honest math, compare-at price',
    status: 'passed',
    detail: 'Verified: Wooden stacking toy shows "Sold out" badge and has no quick-add; Matte lipstick trio shows 19% off (₹649 vs ₹799) with struck compare-at.',
  },
  {
    area: 'Showcase app (boutique preview)',
    item: 'Quick add → cart drawer: add, qty stepper, remove, live badge + subtotal, honest disabled checkout',
    status: 'passed',
    detail: 'Quick add opened the drawer (badge 1); qty +1 → 2 × ₹649 = ₹1,298; remove → empty state; PDP add-to-bag ×3 → ₹2,697 subtotal; checkout disabled with "Preview only. On Shopify this button opens native checkout."',
  },
  {
    area: 'Showcase app (boutique preview)',
    item: 'Product page preview: gallery thumbs, variant pills (200/400 ml), stock dot, qty stepper, WhatsApp deep link + exact message preview',
    status: 'passed',
    detail: 'Variant selection updates "Size: 200 ml"; message builder verified: greeting + product + option + quantity + link + confirm-availability note; button opens wa.me/919898648776 with the encoded message.',
  },
  {
    area: 'Showcase app (boutique preview)',
    item: 'Gift Finder 3-step wizard with reference-exact fallback notes + start again',
    status: 'passed',
    detail: 'Diwali → For her → Under ₹300 returned "2 ideas · Diwali · For her · Under ₹300" with the honest note "Nothing is tagged for Diwali yet…"; Start again resets to step 1; NEXT disabled until a choice is made.',
  },
  {
    area: 'Showcase app (boutique preview)',
    item: 'Wishlist + Recently viewed (device-local, localStorage mahadev-preview:wishlist)',
    status: 'passed',
    detail: 'Heart toggle shows toast "Saved to wishlist on this device", header badge updates, wishlist grid renders the saved card, recently-viewed records product hovers. Device-local only (no cross-device sync) — documented.',
  },
  {
    area: 'Showcase app (boutique preview)',
    item: 'Brands A–Z directory: 30-brand list, live search, alphabet filter with disabled letters, empty state',
    status: 'passed',
    detail: '"lak" → Lakmé; "zzz" → "No brand matches your search."; 15 letter groups; search box shows "Search 30 brands".',
  },
  {
    area: 'Showcase app (boutique preview)',
    item: 'Newsletter + footer with owner-verified contact block (address, maps link, phones, email, Instagram)',
    status: 'passed',
    detail: 'Subscribe shows the honest preview-only confirmation; footer lists A-15 Shivalik Bungalows address, Google Maps link, 9898648776 / 9998268636, mahadevcutlery@gmail.com (owner typed "…comi" — confirm exact spelling).',
  },
  {
    area: 'Showcase app (studio views)',
    item: 'Delivery view reachable from the preview banner; back-navigation; report view reachable',
    status: 'passed',
    detail: '"Download theme & guides" opens the Delivery studio; "← Back to the preview" returns; "Verification report" opens this report.',
  },
  {
    area: 'Delivery artifacts',
    item: 'Theme ZIP download (API + real browser download)',
    status: 'passed',
    detail: 'GET /api/theme-zip → 200, valid ZIP with 52 files (assets/config/layout/locales/sections/snippets/templates only; SPEC.md excluded).',
  },
  {
    area: 'Delivery artifacts',
    item: 'Shopify CSV import template',
    status: 'passed',
    detail: 'Canonical Shopify columns; EXAMPLE rows prefixed "EXAMPLE — DELETE BEFORE IMPORT"; image URLs left empty on purpose; brand/type limits documented.',
  },
  {
    area: 'Delivery artifacts',
    item: 'XLSX import template (dropdown validation + Reference sheet)',
    status: 'passed',
    detail: 'Valid Excel 2007+ workbook; Import sheet with headers + example rows, hidden Lists sheet for Vendor/Type validation, Reference sheet with brand rules.',
  },
  {
    area: 'Delivery artifacts',
    item: '15 AI-generated placeholder images (hero, editorial skincare, 8 departments, gift wrapping, gift finder, secondary)',
    status: 'passed',
    detail: 'All files generated (incl. new hero-editorial + editorial-skincare matching the reference imagery) and served from /images with descriptive alt text.',
  },
  {
    area: 'Code quality',
    item: 'ESLint clean',
    status: 'passed',
    detail: 'bun run lint passes with 0 errors / 0 warnings (useSyncExternalStore for the localStorage wishlist; no setState-in-effect).',
  },
  {
    area: 'Theme features now shown in this preview',
    item: 'Festival countdown banner (Diwali / Raksha Bandhan, Asia/Kolkata, auto-hide) — demonstrated in the preview; live-store rendering still not verified',
    status: 'passed',
    detail:
      'Preview banner verified (see Festival countdown rows). The theme\'s sections/festival-countdown.liquid + assets/countdown.js remain structurally validated; rendering on the live store needs the connected store. Owner must verify festival dates yearly.',
  },
  {
    area: 'Theme features now shown in this preview',
    item: 'Hindi/Gujarati storefront translation — switcher demonstrated in the preview; store-level rendering needs Shopify languages + Translate & Adapt',
    status: 'passed',
    detail:
      'Preview switcher verified (see Languages row). The theme\'s en/hi/gu locale files ship in the ZIP with key parity enforced by the validator; publishing the languages in Shopify admin is the owner\'s step.',
  },
  {
    area: 'Requires Shopify admin (by design, never embedded here)',
    item: 'Store connection, real product import, checkout & payments',
    status: 'not_performed',
    detail: 'Needs the owner’s dev store + credentials. Import flow: bulk spreadsheet → Products → Import (see Beginner Product guide). No claim of imported/connected state is made.',
  },
  {
    area: 'Requires external integration',
    item: 'WhatsApp order completion (real chat with the store)',
    status: 'not_performed',
    detail: 'Deep link verified correct (wa.me/919898648776 with prefilled product, option, qty, link and confirm-availability note); an actual order must be confirmed manually by the store in chat.',
  },
];

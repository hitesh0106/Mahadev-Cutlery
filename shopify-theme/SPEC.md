# SHARED SPEC — Mahadev Cutlery & Gift Articles
Single source of truth for ALL agents (Shopify theme + Next.js showcase). Read fully before writing code.

## 0. Ground rules (anti-fabrication discipline)
- NEVER invent real products, prices, stock, ratings, reviews, discounts, image URLs of real products, or claims of tested/connected/imported things.
- All sample data used in the Next.js showcase is explicitly labeled SAMPLE/DEMO and excluded from the production catalog.
- Never claim: store connected, products imported, checkout tested, theme published. Report "Not performed" honestly.
- NO kitchenware/cutlery department anywhere (business name contains "Cutlery" but taxonomy must not include it).
- No blue/indigo colors anywhere. Warm neutrals + terracotta/gold accent only.

## 1. Store info (theme settings defaults — owner editable)
- Name: MAHADEV CUTLERY & GIFT ARTICLES (logo text: "MAHADEV" + subline "CUTLERY & GIFT ARTICLES")
- Address: A-15, Shivalik Bungalows, Vastral Road, Opposite Ratanpura Gam, Vastral, Ahmedabad, Gujarat 382418, India
- Phone: +91 98986 48776 / +91 99982 68636 (settings: two phone fields)
- Email: mahadevcutlery@gmail.com (note: owner typed "...comi" — likely typo; default without trailing "i", flagged in docs)
- Instagram: https://www.instagram.com/mahadev_cutlery/
- Google Maps: https://maps.app.goo.gl/P3AkDsq9bySkxAVbA
- WhatsApp (theme setting `whatsapp_number`): default "919898648776"
- Footer/policies: no invented policies; link to Shopify policy pages via `shop.privacy_policy` etc.; empty fields must not render.

## 2. Departments (the ONLY ones — no kitchenware)
THE EIGHT approved departments (2026-10-26 taxonomy, owner-approved):
1. Beauty & Makeup (beauty-makeup)   2. Skincare (skincare)   3. Haircare (haircare)
4. Hosiery & Innerwear (hosiery-innerwear)   5. Toys & Kids (toys-kids)
6. Gift Articles (gift-articles)   7. Imitation Jewellery (imitation-jewellery)
8. Accessories & Grooming (accessories-grooming)   (+ Shop All, Brands)
Mixed items (belts, goggles, perfumes) → "Accessories & Grooming" only.
NO kitchenware/cutlery department exists. Canonical vendor spellings: "L'Oréal Paris"
and "L'Oréal Professionnel" (straight apostrophe + é), "Lakmé" (é), "MARS Cosmetics".

## 3. Brand rules (MUST be enforced in copy, CSV reference, brand directory, docs)
- Zoiro → Men's nikar/innerwear ONLY. No women's Zoiro, no t-shirts/sportswear.
- Bodycare → Kids-Boys, Kids-Girls, Women ONLY. No men's Bodycare.
- Lady Care → Women's nikar/panty ONLY. No men's.
- Lotus Herbals → Skincare / face care / haircare ONLY. NEVER under Makeup.
- L'Oréal Paris ≠ L'Oréal Professionnel (keep separate vendors).
- Sunny → only owner-confirmed stocked items; brand identity not guessed.
- Ghar Soaps → identity unverified: configurable, no fabricated catalogue.
- Other known brands: Jockey, Van Heusen, Matrix, Wella Professionals, Garnier, Minimalist,
  O3+, Cetaphil, Sebamed, Pilgrim, Plix, NIVEA, POND'S, Dot & Key, Swiss Beauty, Lakmé,
  MARS, Maybelline New York, Colorbar, Faces Canada, VEGA, Philips.
- Never auto-generate brand collections for manufacturers whose stock is unconfirmed.

## 4. Design tokens (exact names)
```css
--mc-bg:#FFFFFF; --mc-bg-soft:#FAF8F5; --mc-cream:#F5F0E9; --mc-grey:#F4F4F2;
--mc-ink:#20201E; --mc-ink-soft:#6F6B66; --mc-accent:#B8875A; --mc-accent-soft:#F2E5D8;
--mc-border:#EAE6E0; --mc-success:#287A53; --mc-error:#B42318;
--mc-radius:14px; --mc-radius-sm:10px; --mc-shadow:0 10px 30px rgba(32,32,30,.07);
--mc-ease:cubic-bezier(.22,.61,.36,1); --mc-dur:.45s;
```
Typography: headings = elegant serif ("DM Serif Display", fallback Georgia/serif); body = Inter
(fallback system sans). Fluid clamp() sizes. Section padding ~ clamp(56px, 8vw, 110px).
Motion: CSS transitions + IntersectionObserver reveals (`.mc-reveal` → `.is-visible`),
`prefers-reduced-motion` respected, no layout shift, no oversized scaling.

## 5. Shopify theme conventions (shopify-theme/)
- Prefix all CSS classes with `mc-`; JS under `window.MC` namespace; attributes `data-mc-*`.
- Assets: `base.css` (design system), `theme.js` (header/menu/cart drawer/reveals/ajax cart),
  `wishlist.js` (localStorage), `countdown.js` (festival), `gift-finder.js` (finder logic).
- localStorage keys: `mc_wishlist_v1` (array of {handle,title,vendor,price,image,url,addedAt}),
  `mc_recently_viewed_v1` (same shape, max 12, excludes current product).
- Currency: `{{ price | money }}` INR. Prices from Shopify only.
- Wishlist & recently-viewed: device-local (documented limitation; no cross-device sync, no accounts).
- Gift wrap: line item properties `Gift wrap` = "Yes" and `Gift message` (≤200 chars, validated).
  If theme setting `gift_wrap_charged` is true, JS adds product with handle = setting
  `gift_wrap_product_handle` (merchant creates "Gift Wrapping" product with real price) and removes
  it when unchecked. Never display an invented fee.
- WhatsApp button: `https://wa.me/{{ settings.whatsapp_number }}?text=...` prefilled with product
  title, chosen variant, quantity, product URL, plus note "Please confirm availability & price."
  Render only when setting non-empty. Setting `whatsapp_enabled` toggles.
- Festival countdown: `sections/festival-countdown.liquid` — settings per festival:
  { enabled, name, date (ISO), bg, text color, link }. Server-side Liquid hides if past;
  JS `countdown.js` ticks to the date in `Asia/Kolkata` (use `Intl.DateTimeFormat` with
  `timeZone:'Asia/Kolkata'`). CTA "Find a Gift" → gift finder section/page. Defaults:
  Diwali 2026-11-08 (active), Raksha Bandhan 2026-08-28 (past → hidden; next 2027-08-17, owner verifies yearly).
- Gift finder: `sections/gift-finder.liquid` reads a configured collection; Liquid embeds product
  JSON in `<script type="application/json" data-mc-gift-products>` (handle,title,vendor,price,
  compare_at_price,available,image,tags,url). Tag conventions: `gf-oc-diwali`, `gf-oc-rakhi`,
  `gf-oc-birthday`, `gf-oc-anniversary`, `gf-oc-wedding`; `gf-for-her|him|kids|couple|family`;
  `gf-under-199|gf-199-499|gf-500-999|gf-1000-plus`. JS `gift-finder.js` 3 steps
  (occasion → recipient → budget), only in-stock matching items, graceful empty state, reset,
  keyboard accessible, mobile-first.
- Locales `locales/en.default.json`, `locales/hi.json`, `locales/gu.json` — SAME key tree.
  Brand/product/price names never translated. Full-store translation requires Shopify
  "Translate & Adapt" + published hi/gu languages (documented, not claimed done).
- Section schema: always include `presets` where insertable; every heading/color/link editable;
  hide-when-empty behavior for department links.

## 6. Next.js showcase app (src/) — ONLY route `/`
- Premium light editorial design with tokens from §4; Tailwind 4 + shadcn/ui; sticky footer
  (min-h-screen flex flex-col + mt-auto); fully responsive; framer-motion subtle.
- Views via client tabs (single page): Storefront Preview | Gift Finder | Product Demo |
  Delivery & Downloads | Verification Report. Top: persistent "SAMPLE CATALOGUE" notice.
- Demo catalog served by `/api/demo-products` from `src/lib/catalog.ts` (shape:
  id, handle, title, brand, department, subcategory, type, tags[], priceInr, compareAtInr:null,
  available, sizes[], colors[], image, url, gfTags[], giftWrapEligible, isSample:true).
  No discounts, no ratings. Sample prices marked as sample in UI.
- Wishlist/recently-viewed: same localStorage keys as theme (`mc_wishlist_v1`, `mc_recently_viewed_v1`).
- Images at /images/*.jpg (AI-generated placeholders, alt text required).
- Fonts: next/font Google DM_Serif_Display + Inter. Footer shows verified store info only
  (no empty fields). Countdown identical math to theme (Asia/Kolkata, Diwali 2026-11-08).

## 7. Delivery artifacts
- `download/mahadev-theme.zip` (pure theme: assets/config/layout/locales/sections/snippets/templates)
- `download/mahadev-products-import-template.csv` (canonical Shopify columns, 3 EXAMPLE rows marked)
- `download/mahadev-products-import-template.xlsx` (exceljs; Import sheet + Reference sheet with
  allowed brands/departments/types/rules + data-validation dropdowns, 3 EXAMPLE rows)
- Guides (in-app + docs/): install, admin config, brand/category rules, beginner product upload,
  metafields, policies/shipping, cart/checkout test, languages (Translate & Adapt), limitations.

## 8. PINNED locale key tree (sections use ONLY these keys via `| t`; en.default.json must contain all; hi/gu may fall back to English per Shopify behavior)
```json
{
  "general": { "menu", "close", "search", "search_placeholder", "search_no_results", "previous", "next", "loading", "skip_to_content", "language_label" },
  "header": { "home", "shop_all", "departments", "brands", "types", "offers", "account", "wishlist", "cart", "search" },
  "announcement": { "note" },
  "cart": { "title", "empty", "empty_cta", "product", "price", "quantity", "total", "subtotal", "checkout", "remove", "update", "add_to_cart", "added_to_cart", "sold_out", "unavailable", "qty_decrease", "qty_increase", "view_cart", "taxes_note", "note_label", "gift_wrap", "gift_message", "gift_message_placeholder", "remove_gift_wrap" },
  "wishlist": { "add", "added", "remove", "title", "empty", "device_note" },
  "whatsapp": { "order_on_whatsapp", "disclaimer" },
  "gift_wrap": { "title", "checkbox_label", "message_label", "message_max", "note_charged", "note_free", "product_required" },
  "finder": { "title", "subtitle", "step_occasion", "step_recipient", "step_budget", "choose", "next", "back", "results_count", "empty_title", "empty_body", "reset", "restart", "view_product", "sold_out", "restart_title" },
  "countdown": { "ends_in", "days", "hours", "minutes", "seconds", "find_gift", "expired_note" },
  "products": { "related_title", "same_brand_title", "recently_viewed_title", "quantity", "size", "color", "availability", "in_stock", "out_of_stock", "sku", "vendor", "type", "description", "view_details", "quick_add", "sample_note", "regular_price" },
  "collections": { "filter", "sort", "clear", "apply", "empty", "products_count", "price", "brand", "availability", "in_stock_only", "type", "load_more", "page", "no_filters_note" },
  "search": { "title", "placeholder", "results_with_count", "empty", "pages" },
  "brands": { "directory_title", "all", "no_collection_note" },
  "newsletter": { "title", "subtitle", "placeholder", "submit", "success", "disclaimer" },
  "footer": { "shop", "departments", "brands", "support", "contact", "follow", "policies", "copyright", "store_hours", "whatsapp_note" },
  "language": { "selector_label", "partial_note", "english", "hindi", "gujarati" },
  "departments": { "title", "empty_note" },
  "page404": { "title", "body", "cta" }
}
```
(A key listed here but unused is fine; a key used but missing from en.default.json is NOT fine.)

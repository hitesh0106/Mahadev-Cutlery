# TESTING & VALIDATION REPORT — MAHADEV CUTLERY & GIFT ARTICLES

Statuses are **honest**: **Passed** (verified in this environment, with evidence),
**Failed** (found broken → fixed → re-verified), **Requires merchant data** (the
system supports it but the actual value must come from the owner), **Not
performed** (cannot be verified here — needs Shopify admin/credentials/external
services). Nothing is claimed as done without evidence.

Last updated: 26 Oct 2026 (taxonomy implementation round).

---

## 1. Catalogue taxonomy (PART 13 checklist)

| # | Check | Status | Evidence |
|---|-------|--------|----------|
| 1 | All CSV files parse with consistent columns | **Passed** | `bun scripts/validate-catalog.ts` — brand-department-map (30 rows), department-collection-seed (8 rows), product-import-template (5 rows × 30 cols) |
| 2 | No duplicate brand names / inconsistent spelling | **Passed** | Validator: duplicate scan + canonical spellings (Lakmé, straight-apostrophe L'Oréal, MARS Cosmetics); a real inconsistency ("MARS" vs "MARS Cosmetics", curly L'Oréal) was **found and fixed** |
| 3 | Department names ∈ the eight approved departments | **Passed** | Validator checks every brand row, collection seed, sample product and both app data modules against the approved list |
| 4 | Special brand restrictions encoded | **Passed** | Zoiro/Bodycare/Lady Care/Lotus Herbals prohibition texts asserted in the CSV |
| 5 | L'Oréal Paris ≠ L'Oréal Professionnel | **Passed** | Two separate rows, each prohibits merging; separate collection seeds |
| 6 | Zoiro men-only | **Passed** | Prohibits women's/girls'/boys' collections |
| 7 | Bodycare has no men's category | **Passed** | Prohibits "Bodycare Men's" / "Men's Bodycare Innerwear" |
| 8 | Lady Care women-only | **Passed** | Prohibits men's/boys'/girls' (girls' only if merchant revises the rule) |
| 9 | Lotus Herbals never auto-makeup | **Passed** | Prohibition text + Skincare primary department |
| 10 | Sunny requires verified stock | **Passed** | `stock-verification-required` status + product-level verification checklist |
| 11 | Ghar Soaps requires identity + catalogue verification | **Passed** | `identity-unverified` status; stays unpublished until confirmed |
| 12 | No kitchenware/cutlery department | **Passed** | Scanner across all data/code/docs (allows only the "no kitchenware" statements and the store name) |
| 13 | No invented products or prices | **Passed** | Import template contains only marked EXAMPLE rows (Published=FALSE, Status=draft); Image Src and Compare-at empty; sample catalogue is labelled SAMPLE everywhere |
| 14 | Product cards use genuine Shopify records | **Passed (theme) / Not performed (live store)** | Theme cards render Shopify product Liquid objects (`product.price`, `product.available`, real images); the showcase explicitly uses labelled SAMPLE data. Live-store rendering needs the connected store |
| 15 | Brand/department links don't lead to broken collections | **Passed (by architecture)** | The theme renders only owner-picked collections/menus and hides empties; the preview maps nav links to real section anchors (agent-browser verified). Live collection URLs need merchant menus |
| 16 | Theme + ZIP structure valid | **Passed** | `scripts/validate-theme.ts` — 53 files, JSON/Liquid/locale-key validation ✓; ZIP route serves 52 theme files |

## 2. Theme & preview functionality (this round)

| Check | Status | Evidence |
|-------|--------|----------|
| Eight-department rename applied across preview (grid, mega menu, nav, footer) | **Passed** | `validate-catalog.ts` + agent-browser rendering |
| Festival countdown banner (Diwali 2026-11-08, Asia/Kolkata, live ticker, Gift-Finder CTA, auto-hide rules) | **Passed** | Browser: ticker ticks (06→04), correct values, Raksha Bandhan (passed) hidden; ended-state logic unit-checked in bun |
| Gift wrap (checkbox + message ≤200 chars + counter, cart line properties, WhatsApp message includes wrap + message) | **Passed** | Browser: counter "165 अक्षर बाकी" (200−35), cart line shows "Gift wrap: Yes · Gift message: …", WhatsApp preview includes both lines |
| Charged gift-wrap mode | **Implemented, Not performed with a real fee** | Mirrors theme.js: adds the real "Gift Wrapping" product per wrapped item; preview never invents a fee (charged=false default). Owner configures a real product in Theme settings |
| EN/HI/GU language switcher (interface strings, brands/titles/prices preserved, `<html lang>` + persistence) | **Passed** | Browser: nav/hero/countdown/cart/gift-finder translated in हिन्दी and ગુજરાતી; "Jockey" stays Latin; `document.documentElement.lang` = hi/gu; persists across reload |
| Gift Finder fallback notes (structured, localized) | **Passed** | Browser (Hindi): "दिवाली के लिए अभी कुछ टैग नहीं है…" honest note |
| **Gift Finder crash** (products without a `tags` array crashed results when price matched the budget) | **Failed → Fixed → Re-verified** | Found via mobile browser walk (Birthday + Kids + ₹300–699): `p.tags.map` on undefined. Fixed (`tags: []` default + defensive `(p.tags ?? [])`), re-verified: empty state + results both render |
| Mobile 390px: no horizontal overflow | **Failed → Fixed → Re-verified** | 394px overflow from the language switcher; fixed (compact mobile button); scrollWidth = 390 = innerWidth |
| Mobile flows: menu drawer + nested Shop All, gift wrap + add to bag + cart properties, honest empty state | **Passed** | agent-browser at 390×844 |
| Desktop flows regression: search, quick-add cart, wishlist, brands A–Z, delivery downloads | **Passed** | Carried from prior verified rounds; routes re-curl-verified (ZIP 52 files, CSV, XLSX, new catalogue CSVs, bogus → 400) |

## 3. Delivered files (PART 12)

| File | Status |
|------|--------|
| `docs/BRAND_DEPARTMENT_MAP.md` | **Created** — 30 brand profiles + O3+ note, cross-cutting rules |
| `docs/PRODUCT_TAXONOMY.md` | **Created** — 8 departments, type hierarchy, customer groups, collections, tags, metafields, filters |
| `docs/PRODUCT_IMPORT.md` | **Created** — CSV instructions, validation rules, import workflow, verification workflow |
| `data/brand-department-map.csv` | **Created + validated** |
| `data/department-collection-seed.csv` | **Created + validated** |
| `data/product-import-template.csv` | **Created + validated** (canonical file; generated variants at `/api/products-csv`, `/api/products-xlsx`) |
| `docs/TESTING_REPORT.md` | **Created** (this file) |
| Previous theme backup | **Created** — `backups/shopify-theme-pre-taxonomy-20261026/` (unchanged copy taken before edits) |
| Updated theme ZIP | **Passed** — `/api/theme-zip` regenerates from the updated `shopify-theme/` (theme menu info strings now name the eight approved departments) |

## 4. Requires merchant configuration (never performed here)

- Connecting the Shopify development store; uploading/publishing the theme.
- Importing real products (templates + workflow provided; nothing imported — no claim of import is made).
- Creating the actual collections/menus (seed file provided; theme hides empty collections).
- Payments, shipping, policies, taxes.
- Publishing Hindi/Gujarati in Shopify (Settings → Languages + Translate & Adapt); the theme ships en/hi/gu locale files.
- Festival dates re-verification each year (Diwali 2026-11-08 preconfigured, Asia/Kolkata).
- Confirming the store email spelling (owner input "mahadevcutlery@gmail.comi" treated as `mahadevcutlery@gmail.com`).

## 5. Not performed (honest)

- Live-store rendering, checkout and payments testing — no store connection/credentials exist in this environment.
- Official `shopify theme check` CLI — unavailable in the sandbox; the custom structural validator (JSON, Liquid tag balance, locale-key parity, template/section/snippet/asset resolution) passes.
- Real WhatsApp chat completion — deep link + message verified; the order confirmation is manual in chat.
- Cross-device wishlist sync — by design device-local (localStorage), documented in the guides.

# Mahadev Cutlery & Gift Articles — Shopify Online Store 2.0 Theme

Production-ready, editable Shopify Online Store 2.0 theme built for **Mahadev Cutlery & Gift Articles** (Ahmedabad, Gujarat).

This repository is structured for **direct native connection with Shopify** via the Shopify GitHub Integration (`Online Store → Themes → Add theme → Connect from GitHub`).

---

## 🛍️ Connecting to Shopify via GitHub

1. In **Shopify Admin**, go to **Online Store** → **Themes**.
2. Under **Theme library**, click **Add theme** → **Connect from GitHub**.
3. Select this repository: `hitesh0106/Mahadev-Cutlery`.
4. Select the branch: `main`.
5. Shopify will automatically detect the theme at the root of the repository and sync all theme files:
   - `layout/theme.liquid`
   - `config/settings_schema.json` & `settings_data.json`
   - `locales/en.default.json`, `hi.json`, `gu.json`
   - `templates/*.json`
   - `sections/*.liquid`
   - `snippets/*.liquid`
   - `assets/*`
6. Once connected, click **Customize** to open the visual Shopify Theme Editor.
7. Any customization changes made in the Shopify Theme Editor are automatically committed back to GitHub!

---

## 📁 Repository Structure

```
.
├── assets/                  # CSS styles, JS engines (theme, cart, wishlist, countdown, gift-finder), images
├── config/                  # settings_schema.json (theme controls) and settings_data.json (defaults)
├── layout/                  # theme.liquid (Shopify OS 2.0 master layout)
├── locales/                 # en.default.json, hi.json (Hindi), gu.json (Gujarati)
├── sections/                # 23 Online Store 2.0 custom sections with schemas and blocks
├── snippets/                # 11 reusable Liquid snippets (product-card, cart-drawer, whatsapp, etc.)
├── templates/               # 11 OS 2.0 JSON templates (index, product, collection, cart, search, etc.)
├── data/                    # Department collection seeds, Brand-department maps, Product import templates
├── docs/                    # Installation guides, QA audit reports, and taxonomy documentation
│   ├── OWNER_SETUP_CHECKLIST.md
│   ├── SHOPIFY_INSTALLATION.md
│   ├── SHOPIFY_THEME_AUDIT.md
│   ├── BRAND_DEPARTMENT_MAP.md
│   ├── PRODUCT_TAXONOMY.md
│   ├── PRODUCT_IMPORT.md
│   └── TESTING_REPORT.md
├── download/                # Ready-to-upload ZIP packages for manual installation
├── scripts/                 # Automated theme packaging and catalogue validation scripts
├── src/                     # Next.js showcase & storefront preview application
├── .shopifyignore           # Tells Shopify GitHub sync and Shopify CLI to only touch theme files
├── .theme-check.yml         # Shopify Theme Check linter configuration
└── package.json             # Scripts & developer dependencies
```

---

## 🏷️ The 8 Canonical Departments

The theme strictly enforces the eight approved store departments:

1. **Beauty & Makeup** (`beauty-makeup`)
2. **Skincare** (`skincare`)
3. **Haircare** (`haircare`)
4. **Hosiery & Innerwear** (`hosiery-innerwear`)
5. **Toys & Kids** (`toys-kids`)
6. **Gift Articles** (`gift-articles`)
7. **Imitation Jewellery** (`imitation-jewellery`)
8. **Accessories & Grooming** (`accessories-grooming`)

*(Note: Zero kitchenware or cutlery shopping products are allowed. Despite the heritage store name, the physical store does not sell kitchen cutlery or cookware).*

---

## ⚙️ Testing & Validation Commands

### 1. Official Shopify Theme Check
```bash
shopify theme check --path .
```
- Passes with **0 errors**.

### 2. Custom Liquid & JSON Integrity Validator
```bash
bun scripts/validate-theme.ts
```

### 3. Catalogue Taxonomy Validator
```bash
bun scripts/validate-catalog.ts
```
- Verifies all 39 catalogue, brand restriction, and collection seed rules.

### 4. Package Theme ZIPs
```bash
bun scripts/package-theme.ts
```
- Generates `download/mahadev-cutlery-shopify-theme-final.zip` (1.82 MB).
- Generates `download/mahadev-theme.zip` (1.82 MB).
- Generates `public/downloads/mahadev-cutlery-shopify-theme.zip` (1.82 MB).

---

## 🏛️ Header Architecture & Responsive System

The storefront features an editorial 2-row luxury brand header designed for 100% browser zoom:

### 1. Announcement Bar (Row 0)
- Centered, slim announcement bar with smooth background (`#20201E`) and cream text (`#FAF8F5`).
- Supports rotating multi-message announcements with pause on hover and keyboard-accessible prev/next arrows.
- Fully editable text, links, and colors in Shopify Theme Customizer (`Header` section).

### 2. Main Brand Row (Row 1)
- **CSS Grid `1fr auto 1fr`:** Mathematically guarantees the **MAHADEV** serif wordmark and letter-spaced **CUTLERY & GIFT ARTICLES** subline stay 100% centered in the viewport at all times, never pushed off-center by asymmetrical left or right controls.
- **Left Column:** Quick search trigger button and mobile drawer hamburger toggle.
- **Right Column:** Accessible account icon (linking to Shopify customer accounts), wishlist indicator, and AJAX cart drawer trigger with dynamic item counter bubble.
- **Consistent Icons:** All controls share 40px touch targets, 20px SVG icon sizes, and 1.6 stroke width.

### 3. Primary Navigation Row (Row 2) & Intelligent Adaptive Menus
- Centered navigation row directly beneath the brand row, showcasing the 8 approved primary departments with collection routes.
- **Intelligent "More ▾" Dropdown:** On laptop widths (`1024px`–`1399px`) or high-DPI displays with OS scaling, secondary items (`Accessories & Grooming`, `All Brands`, `Departments`, `Offers`, `Home`) adaptively collapse into a styled "More" dropdown. Links never clip at the viewport edges, never overlap, and never force customers to zoom out.
- **Dynamic JavaScript Fit Observer:** Automatically measures navigation scroll width vs. available container width on resize, applying compact spacing if merchant adds extra navigation links.
- **Hover Bridges:** Added invisible hover bridges (`::after`) preventing mega-menus and dropdowns from prematurely closing when moving cursor from trigger to menu panel.
- **Clean Mobile Drawer (`< 1024px`):** Replaces desktop navigation with an accessible off-canvas drawer featuring accordion department navigation, quick search, and customer links without duplicate menus.

### 4. Zero Placeholder / Sample Content
- Removed all hardcoded `SAMPLE BRAND`, fake prices, and sample cards from customer-facing liquid sections.
- When collections are empty, standard Shopify OS 2.0 onboarding placeholder cards (`placeholder_svg_tag`) or graceful empty states are rendered with zero fake pricing or invented discounts.

---

## 📍 Store Information

- **Store Name:** MAHADEV CUTLERY & GIFT ARTICLES
- **Address:** A-15, Shivalik Bungalows, Vastral Road, Opposite Ratanpura Gam, Vastral, Ahmedabad, Gujarat 382418, India
- **Phone 1:** 9898648776
- **Phone 2:** 9998268636
- **Email:** mahadevcutlery@gmail.com
- **Instagram:** [@mahadev_cutlery](https://www.instagram.com/mahadev_cutlery/)
- **Google Maps:** [Location Link](https://maps.app.goo.gl/P3AkDsq9bySkxAVbA)

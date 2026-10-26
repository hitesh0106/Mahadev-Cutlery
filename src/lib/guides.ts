// Guide content for the Delivery & Downloads view.
// Plain-text bodies rendered in-app (markdown-ish: lines starting with "## " are headings,
// "- " bullets, "1." numbered steps, **bold** spans).

export type Guide = {
  id: string;
  title: string;
  subtitle: string;
  sections: { heading: string; body: string }[];
};

export const GUIDES: Guide[] = [
  {
    id: 'install',
    title: 'Theme Installation Guide',
    subtitle: 'From ZIP to a live preview — no coding required',
    sections: [
      {
        heading: '1. Download the theme ZIP',
        body: `Use the **Download Theme ZIP** button on this page. The ZIP contains only valid Shopify theme folders (assets, config, layout, locales, sections, snippets, templates).`,
      },
      {
        heading: '2. Upload to Shopify',
        body: `1. Open your Shopify Admin → **Online Store → Themes**.
2. Click **Add theme → Upload zip file** and choose *mahadev-theme.zip*.
3. Wait for the upload to finish. The theme appears in your Theme library.
4. **Do NOT publish it yet.** First preview it (next step).`,
      },
      {
        heading: '3. Preview before publishing',
        body: `1. On the theme card click **⋯ → Preview**.
2. Check the homepage, a collection, and a product page.
3. Only when you are satisfied, click **⋯ → Publish**. Never overwrite your live theme without checking the preview first.`,
      },
      {
        heading: '4. Configure the theme (Theme editor)',
        body: `1. Click **Customize** on the theme.
2. **Theme settings → Store information**: verify address, both phone numbers, e-mail and Instagram link. Empty fields are hidden automatically — fill only what applies.
3. **Theme settings → WhatsApp ordering**: turn it on and confirm the number (default uses 91 98986 48776).
4. **Theme settings → Gift wrapping**: choose Free or Charged. If Charged, create a real "Gift Wrapping" product in Shopify with your actual price, then select it in the setting (see the Product guide).
5. **Theme settings → Festival countdown**: set the festival name, exact date (Asia/Kolkata) and colors. Past festivals hide automatically.
6. Save.`,
      },
      {
        heading: '5. Create navigation menus',
        body: `Shopify Admin → **Content → Menus**:
- **main-menu**: Home, Shop All, then your departments, Brands, Offers.
- **footer-menu**: your policy/contact links.
- Optional **departments-menu** and **brands-menu** for the mega menu columns.
The theme only shows links you create — it never invents categories.`,
      },
      {
        heading: '6. Required Shopify Admin setup (theme cannot do this)',
        body: `- Products & collections (import real products — see the product guide).
- Policies: Settings → Policies (refund, privacy, terms, shipping).
- Payments & shipping: Settings → Payments / Shipping and delivery.
- Languages: Settings → Languages → add Hindi/Gujarati, then the **Translate & Adapt** app for translations.
- Metafields (optional): Settings → Custom data → Products → add *department*, *subcategory* (single line text).`,
      },
    ],
  },
  {
    id: 'products',
    title: 'Beginner Product Management Guide',
    subtitle: 'Adding real products with the bulk spreadsheet',
    sections: [
      {
        heading: 'A. Download the templates',
        body: `- **XLSX spreadsheet**: has an *Import* sheet (all Shopify columns + dropdown validation for brand/department) and a *Reference* sheet listing the allowed brands, departments, product types and the brand rules.
- **CSV template**: the same columns in plain CSV for direct Shopify import.
Both contain 3 rows clearly marked **EXAMPLE — delete them** before importing.`,
      },
      {
        heading: 'B. Fill the spreadsheet correctly',
        body: `1. **Handle**: one word-with-dashes id per product, repeated on every row of that product (variants use the same handle).
2. **Title**: the real name printed on the product/packaging.
3. **Vendor**: choose from the dropdown (this is the brand). Follow the brand rules on the Reference sheet — e.g. Zoiro = men's nikar only; Lotus Herbals never goes under Makeup.
4. **Type / Department / Subcategory**: use the dropdown values so filters work.
5. **Body (HTML)**: short honest description; leave blank if you prefer.
6. **Variant rows**: Option1 Name = "Size" and Option1 Value = "M", etc. One row per variant.
7. **Variant Price**: the REAL selling price in INR (e.g. 249.00). Compare-at only if there is a genuine before-price — otherwise leave empty.
8. **Variant Inventory Qty**: actual count in the shop. Inventory Tracker = "shopify".
9. **Image Src**: paste the image web address (right-click your photo on Google Drive/public link and copy) or leave empty and upload photos directly in Shopify Admin later. **Never invent URLs.**
10. **Tags**: add gift-finder tags if you want products discoverable in the Gift Finder: gf-oc-diwali, gf-oc-rakhi, gf-oc-birthday, gf-oc-anniversary, gf-oc-wedding, gf-for-her, gf-for-him, gf-for-kids, gf-for-couple, gf-for-family, gf-under-199, gf-199-499, gf-500-999, gf-1000-plus.`,
      },
      {
        heading: 'C. Import into Shopify',
        body: `1. Save as CSV (in Excel: File → Save As → CSV UTF-8).
2. Shopify Admin → **Products → Import** → Add file → **Upload and continue** → **Preview** → **Import products**.
3. Check the imported products: open each one, verify price, images, vendor and inventory.
4. **Publish** the products (they must be on the Online Store channel to appear).`,
      },
      {
        heading: 'D. Collections — automatic vs manual',
        body: `Create these **automated** collections (Products → Collections → Create → Automated, condition = Product vendor is…): one per brand you actually stock.
Create **automated** department collections with condition Product type is… (e.g. "Shampoo") or tag conditions (e.g. tag = "skincare").
Gift Articles / festive / manual bundles: **manual** collections where you add products by hand.
The theme links only to collections you select in the theme editor — empty ones can simply be unlinked.`,
      },
      {
        heading: 'E. Everyday edits',
        body: `- **Price/stock change**: Products → open product → edit → Save. Live immediately.
- **New product**: follow this guide from step B, or duplicate an existing similar product.
- **Sold out**: keep the product but set inventory 0 — the theme shows a genuine Sold out state.
- **Photos**: Shopify Admin → product → Media → Upload. Use bright, square, real photos of your own stock.`,
      },
    ],
  },
  {
    id: 'brands',
    title: 'Brand & Category Rules',
    subtitle: 'The merchandising rules baked into the theme and templates',
    sections: [
      {
        heading: 'Strict brand rules',
        body: `- **Zoiro** — men's nikar/innerwear ONLY. No women's Zoiro, no t-shirts/sportswear.
- **Bodycare** — Kids-Boys, Kids-Girls and Women ONLY. No men's Bodycare.
- **Lady Care** — women's nikar/panty ONLY.
- **Lotus Herbals** — never auto-classified as makeup; skincare/face care/haircare by default, and any actual cosmetic item is classified correctly per product.
- **L'Oréal Paris** and **L'Oréal Professionnel** are separate brands — never merge vendors, collection handles or imports.
- **Sunny** — only items you confirm are stocked; every product needs name, category, customer group, price, image and inventory confirmed.
- **Ghar Soaps** — identity pending your confirmation; nothing is fabricated and the brand stays unpublished until verified.
- Full 30-brand profiles: see docs/BRAND_DEPARTMENT_MAP.md and data/brand-department-map.csv.`,
      },
      {
        heading: 'Department rules',
        body: `Exactly these EIGHT departments exist: Beauty & Makeup, Skincare, Haircare, Hosiery & Innerwear, Toys & Kids, Gift Articles, Imitation Jewellery, Accessories & Grooming.
**There is no kitchenware/cutlery department** — the store name includes "Cutlery", but the online taxonomy intentionally does not. Belts, goggles, perfumes and other mixed items belong to *Accessories & Grooming* (or All Products) — never to invented brand-specific categories. A product can have a secondary merchandising collection without changing its primary department.`,
      },
      {
        heading: 'How the theme enforces this',
        body: `- Brand collections are created by YOU with a "Product vendor is X" condition — the theme never auto-creates brands.
- The Gift Finder only recommends products from your real catalogue that you tagged with gf-* tags.
- Products also carry department_/audience_/type_/brand_ tags (see docs/PRODUCT_TAXONOMY.md) so filters and search work.
- The showcase and templates never display invented products, prices, ratings or discounts.`,
      },
    ],
  },
  {
    id: 'languages',
    title: 'Languages (EN / हिंदी / ગુજરાતી)',
    subtitle: 'What is included and what Shopify requires',
    sections: [
      {
        heading: 'What is delivered',
        body: `The theme ships with three locale files: **en.default.json** (complete), **hi.json** and **gu.json** (interface strings translated: navigation, buttons, cart, filters, gift finder, footer, etc.). Product titles, brand names and prices are never translated.`,
      },
      {
        heading: 'What you must enable in Shopify',
        body: `1. Shopify Admin → **Settings → Languages** → add Hindi and Gujarati.
2. Install the free **Translate & Adapt** app.
3. Import/auto-translate the theme interface strings there (or keep them — the theme's bundled translations are used when the language is published).
4. Until Hindi/Gujarati are published in your Shopify settings, the store displays English regardless of the selector.`,
      },
      {
        heading: 'Honest scope note',
        body: `The bundled translations cover the theme INTERFACE, not the entire store (product descriptions, policies, checkout, emails, notifications remain in the store languages you configure in Shopify). This is the standard Shopify architecture — checkout translation, for example, is managed in Settings → Languages/Checkout, not in the theme.`,
      },
    ],
  },
  {
    id: 'limitations',
    title: 'Known Limitations & Required Setup',
    subtitle: 'Reported honestly — what needs your action or a Shopify app',
    sections: [
      {
        heading: 'Requires Shopify Admin configuration by the owner',
        body: `- Real products, prices, inventory and collections (theme cannot create them).
- Payments provider, shipping zones/rates and store policies.
- Publishing Hindi/Gujarati languages + Translate & Adapt app for full localization.
- Uploading your own final logo/photos (AI placeholder images are design previews only).`,
      },
      {
        heading: 'Device-local features (by design)',
        body: `**Wishlist** and **Recently viewed** use the browser's local storage: they work per device/browser, do not sync across devices and clear if the customer clears site data. This was the agreed approach (no third-party app). If cross-device sync is wanted later, install a wishlist app — the theme's wishlist buttons can then be switched off in settings.`,
      },
      {
        heading: 'Requires an external integration / not performed here',
        body: `- Connecting a Shopify development store and importing products: **Not performed** (no store credentials in this environment — by design, credentials are never embedded in themes).
- Live checkout/payment testing: **Not performed** (requires the connected store + payment provider).
- Shopify theme-check / CLI validation: **Not performed** (tooling unavailable in this sandbox); JSON files and Liquid structure were checked manually.
- WhatsApp ordering opens a chat with the configured number; order CONFIRMATION still happens manually in chat.`,
      },
    ],
  },
];

# PRODUCT TAXONOMY — MAHADEV CUTLERY & GIFT ARTICLES

Complete classification system for the Shopify store. Machine-readable sources:
`data/department-collection-seed.csv`, `data/brand-department-map.csv`
(validated by `scripts/validate-catalog.ts`). Brand profiles:
`docs/BRAND_DEPARTMENT_MAP.md`.

---

## 1. The eight approved departments

| # | Department | Shopify handle | Focus |
|---|------------|----------------|-------|
| 1 | Beauty & Makeup | `beauty-makeup` | Lips, eyes, face — cosmetics |
| 2 | Skincare | `skincare` | Cleanse, treat, protect |
| 3 | Haircare | `haircare` | Everyday & professional care |
| 4 | Hosiery & Innerwear | `hosiery-innerwear` | Men, women & kids innerwear |
| 5 | Toys & Kids | `toys-kids` | Play & learn |
| 6 | Gift Articles | `gift-articles` | For every occasion |
| 7 | Imitation Jewellery | `imitation-jewellery` | Everyday sparkle |
| 8 | Accessories & Grooming | `accessories-grooming` | Grooming, tools, belts, eyewear, perfume |

**Strict restriction:** there is **no** Cutlery, Kitchenware, Kitchen Tools or
Cookware department. The store name includes "Cutlery", but the online catalogue
intentionally does not. **Do not add a ninth department without explicit approval.**

## 2. Product-type hierarchy (per department — subject to actual stock)

- **Beauty & Makeup:** Face makeup, Foundation, Concealer, Compact powder, Loose powder, Primer, Blush, Highlighter, Contour products, Makeup setting spray, Lipstick, Lip gloss, Lip liner, Kajal, Eyeliner, Mascara, Eyeshadow, Eyebrow products, Makeup remover, Makeup brushes, Makeup sponges, Cosmetic accessories.
- **Skincare:** Face cleanser, Face wash, Moisturizer, Face cream, Sunscreen, Serum, Toner, Face mask, Sheet mask, Exfoliating products, Lip balm, Eye cream, Body lotion, Body cream, Hand cream, Facial-care products.
- **Haircare:** Shampoo, Conditioner, Hair mask, Hair serum, Hair oil, Hair styling products, Hair colour, Hair treatment products, Hair brushes, Combs, Hair dryers, Hair straighteners, Hair styling tools, Hair accessories.
- **Hosiery & Innerwear:** Men's underwear/nikar, Women's underwear/nikar/panties, Women's innerwear, Children's innerwear, Vests, Undergarments, Socks, Leggings, other verified hosiery.
- **Toys & Kids:** Toys, Dolls, Toy vehicles, Educational toys, Soft toys, Games, Children's accessories, other verified children's products.
- **Gift Articles:** Gift sets, Decorative gifts, Birthday gifts, Festival gifts, Wedding gifts, Anniversary gifts, Greeting cards, Gift packaging, Gift boxes, other verified gift articles.
- **Imitation Jewellery:** Earrings, Necklaces, Chains, Bangles, Bracelets, Rings, Jewellery sets, Pendants, other verified imitation jewellery.
- **Accessories & Grooming:** Grooming accessories, Hair accessories, Beauty tools, Brushes, Combs, Hair dryers, Hair straighteners, selected personal-care accessories, Belts, Goggles, Perfume, other verified miscellaneous accessories.

Rules: only classify by the product's **actual purpose**; never invent benefits,
ingredients, SPF values, skin suitability or medical claims; show age
recommendations only when a reliable product source provides them; never claim
gold/silver/precious stones for imitation jewellery.

## 3. Customer groups

`Men` · `Women` · `Boys` · `Girls` · `Unisex` — plus "Kids" as a browsing group
combining Boys + Girls where useful. **Never infer the customer group from the
brand alone** (e.g. Jockey may be men's or women's depending on the product).
Tags: `audience_men`, `audience_women`, `audience_boys`, `audience_girls`,
`audience_unisex` — applied only when the product data confirms it.

## 4. Collection structure

1. **Primary department collections** — the eight above with the handles shown.
   Automated, keyed on product type or the `department_*` tag.
2. **Brand collections** — automated, condition *Product vendor is [Brand]*,
   created **only** when real stocked products exist. Canonical spellings only
   (see BRAND_DEPARTMENT_MAP). No empty logo collections.
3. **Brand + department collections** — only where real products qualify, e.g.
   Swiss Beauty Makeup, Lotus Herbals Skincare, L'Oréal Paris Haircare,
   L'Oréal Professionnel Haircare, Matrix Haircare, Jockey Men's Innerwear,
   Bodycare Women's Innerwear, Bodycare Boys' Innerwear, Bodycare Girls' Innerwear.
   Never auto-generate every combination.
4. **Merchandising collections** — seasonal/occasion (Diwali, Raksha Bandhan),
   price-based ("Under ₹199"), gift bundles. Manual where the merchant curates.
   A product may belong to secondary collections without changing its primary
   department.

## 5. Tag conventions

| Prefix | Example | Meaning |
|--------|---------|---------|
| `department_` | `department_skincare`, `department_haircare`, `department_beauty_makeup`, `department_hosiery_innerwear`, `department_toys_kids`, `department_gift_articles`, `department_imitation_jewellery`, `department_accessories_grooming` | Primary department (one per product) |
| `audience_` | `audience_men`, `audience_women`, `audience_boys`, `audience_girls`, `audience_unisex` | Verified customer group |
| `type_` | `type_face_wash`, `type_moisturizer`, `type_lipstick`, `type_shampoo`, `type_conditioner`, `type_mens_innerwear`, `type_womens_innerwear`, `type_childrens_innerwear`, `type_hair_brush`, `type_toy` | Product type (snake_case of the Type field) |
| `brand_` | `brand_jockey`, `brand_swiss_beauty`, `brand_loreal_paris`, `brand_loreal_professionnel` | Brand slug |
| `gf-oc-` | `gf-oc-diwali`, `gf-oc-rakhi`, `gf-oc-birthday`, `gf-oc-anniversary`, `gf-oc-wedding` | Gift Finder occasion |
| `gf-for-` | `gf-for-her`, `gf-for-him`, `gf-for-kids`, `gf-for-couple`, `gf-for-family` | Gift Finder recipient |
| `gf-` (budget) | `gf-under-199`, `gf-199-499`, `gf-500-999`, `gf-1000-plus` | Gift Finder budget band |

Do not apply tags indiscriminately — only attributes supported by the product's
actual data.

## 6. Metafield recommendations

| Metafield | Namespace & key | Type | Use |
|-----------|-----------------|------|-----|
| Department | `custom.department` | Single line text | Primary department (mirrors the tag; enables metafield-based filters/collections) |
| Subcategory | `custom.subcategory` | Single line text | Finer grouping within a department |
| Intended customer | `custom.audience` | Single line text | Verified customer group |
| Age range | `custom.age_range` | Single line text | Toys & Kids only, when verified from a reliable source |
| Material claim | `custom.material` | Single line text | Jewellery/accessories, only when verified |

Prefer **structured attributes** (product type, vendor, metafields, Shopify
Standard Product Taxonomy for `Product Category`) over tags wherever a
structured option exists; tags remain the flexible layer for merchandising and
the Gift Finder.

## 7. Filters (Shopify Search & Discovery — data-driven only)

| Collection | Filters to enable |
|------------|-------------------|
| Beauty & Makeup | Brand, Product type, Price, Availability, Colour (where variant colour exists) |
| Skincare | Brand, Product type, Price, Availability |
| Haircare | Brand, Product type, Price, Availability |
| Hosiery & Innerwear | Brand, Customer group, Size, Price, Availability |
| Toys & Kids | Brand, Product type, Price, Availability, Age range (only with verified data) |
| Gift Articles | Product type, Price, Availability, Occasion (tag-based where tagged) |
| Imitation Jewellery | Product type, Colour (where variant colour exists), Price, Availability |
| Accessories & Grooming | Brand, Product type, Price, Availability |

Never display filter options that return no valid results; never show irrelevant
filters for every collection.

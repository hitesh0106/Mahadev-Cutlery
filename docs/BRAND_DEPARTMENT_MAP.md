# BRAND → DEPARTMENT MAP — MAHADEV CUTLERY & GIFT ARTICLES

> Classification rules, not a stock list. A brand appears on the live storefront
> **only** when it has at least one verified stocked product or the merchant has
> deliberately enabled it. Machine-readable copy: `data/brand-department-map.csv`
> (validated by `scripts/validate-catalog.ts`).
>
> **Verification statuses**
> - `rule-verified` — the classification rule is confirmed; each product still needs real stock/price/image before publishing.
> - `stock-verification-required` — every product needs the merchant's confirmation (name, category, customer group, price, image, inventory) before publishing.
> - `identity-unverified` — the brand identity itself is pending; publish nothing until the merchant confirms.

**The eight approved departments:** Beauty & Makeup · Skincare · Haircare · Hosiery & Innerwear · Toys & Kids · Gift Articles · Imitation Jewellery · Accessories & Grooming.
**There is NO kitchenware/cutlery department.** Canonical vendor spellings: `L'Oréal Paris`, `L'Oréal Professionnel`, `Lakmé`, `MARS Cosmetics`, `POND'S`.

---

## A. Hosiery & Innerwear

### 1. Jockey — `rule-verified`
- **Primary department:** Hosiery & Innerwear.
- **Possible types (only when verified):** men's underwear, men's vests, men's innerwear, women's innerwear, women's underwear, women's sleepwear/loungewear (if stocked), socks, other genuine Jockey apparel/innerwear.
- **Customer groups:** Men; Women. Others only when the actual product supports it.
- **Collections (only for real stock):** Jockey · Jockey Men's Innerwear · Jockey Women's Innerwear · Jockey Socks.
- **Never:** invent products or assume all listed categories are stocked.

### 2. Van Heusen — `rule-verified`
- **Primary department:** Hosiery & Innerwear **where the actual product is innerwear**.
- **Possible types:** men's underwear, men's innerwear, vests, women's innerwear (if stocked), other verified products actually sold.
- **Never:** force every Van Heusen product into innerwear — the actual item decides.

### 3. Zoiro — `rule-verified` — 🔒 MANDATORY RESTRICTION
- **Allowed:** men's nikar/underwear; other verified men's innerwear items (if stocked and confirmed).
- **NOT allowed:** women's Zoiro, girls' Zoiro, boys' Zoiro, unverified Zoiro product types.
- **Primary department:** Hosiery & Innerwear.

### 4. Bodycare — `rule-verified` — 🔒 MANDATORY RESTRICTION
- **Allowed:** women's innerwear, girls' innerwear, boys' innerwear, children's hosiery, other verified women's/children's products.
- **Collections (only when supported):** Bodycare Women's · Bodycare Girls · Bodycare Boys.
- **NEVER:** Bodycare Men's / Men's Bodycare Innerwear — no men's category exists.
- **Never:** confuse children's products with women's products.

### 5. Lady Care — `rule-verified` — 🔒 MANDATORY RESTRICTION
- **Allowed:** women's nikar/panty; women's innerwear products when confirmed.
- **NOT allowed:** men's products, boys' products, girls' products (unless the merchant explicitly verifies a suitable product and revises this rule).
- **Primary department:** Hosiery & Innerwear.

---

## B. Beauty & Makeup brands
Actual product identity decides between Beauty & Makeup / Skincare / Haircare / Accessories & Grooming.

### 6. Swiss Beauty — `rule-verified`
Cosmetics (foundation, concealer, compact, blush, highlighter, lipstick, lip gloss, lip liner, kajal, eyeliner, mascara, eyeshadow, primer, setting products) → **Beauty & Makeup**; brushes/sponges → **Accessories & Grooming**. Never assume availability.

### 7. Lakmé — `rule-verified`
Makeup (foundation, concealer, compact, lipstick, lip gloss, kajal, eyeliner, mascara, blush, primer) → **Beauty & Makeup**; skincare (sunscreen, moisturizer, face wash) → **Skincare**. **Never classify skincare as makeup merely because it is Lakmé.**

### 8. Maybelline New York — `rule-verified`
Foundation, concealer, powder, mascara, eyeliner, kajal, lipstick, lip gloss, lip liner, blush → **Beauty & Makeup**. Only import and publish actual stocked products.

### 9. Faces Canada — `rule-verified`
Lips/face/eye cosmetics and nail products → **Beauty & Makeup**; makeup tools → **Accessories & Grooming**.

### 10. Colorbar — `rule-verified`
Lipstick, lip gloss, foundation, concealer, blush, highlighter, kajal, eyeliner, mascara, nail products, makeup tools → **Beauty & Makeup**.

### 11. MARS Cosmetics — `rule-verified`
Lip products, face makeup, eye makeup, palettes, brushes, sponges → **Beauty & Makeup**. Display alias "MARS" is acceptable on cards; keep ONE canonical vendor spelling for imports.

---

## C. Skincare & personal-care brands

### 12. Minimalist — `rule-verified`
Face serums, cleansers, moisturizers, sunscreens, toners → **Skincare**. Use accurate descriptions. **Never invent active-ingredient concentrations, medical claims or skin-condition suitability.**

### 13. Dot & Key — `rule-verified`
Cleansers, moisturizers, serums, sunscreens, face masks, lip care → **Skincare**. Not everything is makeup.

### 14. Cetaphil — `rule-verified`
Cleansers, moisturizers, face/body care, sunscreens → **Skincare**. Verified product descriptions only.

### 15. Sebamed — `rule-verified`
Cleansers, moisturizers, face/body care → **Skincare**.

### 16. POND'S — `rule-verified`
Face wash, face cream, moisturizer, cleansing products → **Skincare**. **Never classify as makeup unless the actual item is a cosmetic.**

### 17. NIVEA — `rule-verified`
Body lotion, cream, moisturizer, lip balm, deodorant → **Skincare** or **Accessories & Grooming** depending on the actual product within the approved structure. Never invent availability.

### 18. Garnier — `rule-verified`
Face wash, cleansers, moisturizers, sunscreens → **Skincare**; haircare and hair colour → **Haircare**. Keep one brand spelling; never duplicate products just to place them in two collections.

### 19. Pilgrim — `rule-verified`
Skincare, serums, cleansers, moisturizers, haircare, hair serums → classify by actual product identity (Skincare or Haircare).

### 20. Plix — `rule-verified`
Skincare, face-care, body-care, other verified personal care → **Skincare** unless the actual intended use differs.

### 21. Lotus Herbals — `rule-verified` — 🔒 MANDATORY RESTRICTION
- **Never automatically classified as makeup.**
- Skincare, face care, sunscreen, cleansing, moisturizers → **Skincare**.
- If an actual stocked item IS a cosmetic, classify **that individual product** correctly — never move the whole brand to makeup.

---

## D. L'Oréal — two separate brands (never merge)

### 22. L'Oréal Paris — `rule-verified`
Shampoo, conditioner, hair serum, hair colour → **Haircare**; face-care/skincare → **Skincare**; cosmetics → **Beauty & Makeup**. **Never dump every product into one department. Never merge vendors, collection handles or imports with L'Oréal Professionnel.**

### 23. L'Oréal Professionnel — `rule-verified`
Professional shampoo, conditioner, hair masks, hair serum, treatments, styling → **Haircare**. **No makeup/skincare collections unless the real catalogue supports them.** Separate brand from L'Oréal Paris in vendor names, handles and imports.

---

## E. Haircare & tools brands

### 24. Matrix — `rule-verified`
Shampoo, conditioner, hair masks, hair serum, treatments, styling, hair colour (if stocked) → **Haircare**.

### 25. Wella Professionals — `rule-verified`
Professional shampoo, conditioner, masks, treatments, styling, hair colour (if stocked) → **Haircare**. Never publish professional claims without verified product information.

### 26. Garnier (dual department)
May appear in **both** Skincare and Haircare only when actual stocked products support both. One brand, one spelling — no duplicate listings.

### 27. VEGA — `rule-verified`
Hair brushes, combs, hair dryers, hair straighteners, styling tools, grooming and beauty tools → **Accessories & Grooming** (or Haircare-related collections where appropriate). The actual product type decides the primary department.

### 28. Philips — `rule-verified`
Hair dryers, hair straighteners, trimmers, grooming devices, personal-care appliances (only when stocked) → **Accessories & Grooming**. **Never invent models, electrical specifications, warranty terms or availability.**

---

## F. Restricted / pending brands

### 29. Sunny — `stock-verification-required` — 🔒 MANDATORY RESTRICTION
Only verified Sunny products **actually stocked** may be included. For every Sunny product confirm: exact name, category, intended customer group, price, actual product image, inventory. If details cannot be verified, keep the item out of the live catalogue. Never assume a product type from the brand name.

### 30. Ghar Soaps — `identity-unverified` — 🔒 MANDATORY RESTRICTION
Verify the **exact brand identity** and the actual stocked catalogue before publishing anything: brand identity, product name, type, packaging, size, price, image, ingredients/claims as shown, inventory. Do not treat similarly named brands as the same company. If identity cannot be verified, keep the brand **unpublished** until the merchant confirms.

### 31. O3+ — `stock-verification-required`
Verified skincare products per actual product; confirm stocked SKUs with the merchant before publishing.

---

## Cross-cutting rules

1. A product's **primary department** never changes to fit a merchandising collection; secondary collections are additive.
2. No kitchenware/cutlery products or departments anywhere.
3. Belts, goggles, perfumes and mixed items → **Accessories & Grooming** (or All Products) — never dedicated brand categories.
4. Brand collections are created **by the merchant** with "Product vendor is X" conditions — the theme never auto-creates brands, and empty/unverified brands are never displayed.
5. Never fabricate SKUs, barcodes, inventory, prices, images, ratings, reviews, discounts, bestseller ranks, ingredients, warranty or delivery promises.

# MERCHANT SETUP CHECKLIST
**Store:** MAHADEV CUTLERY & GIFT ARTICLES  
**Theme Package:** `download/mahadev-cutlery-shopify-theme-final.zip`  
**Purpose:** Actionable checklist of tasks required inside **Shopify Admin** before publishing your live store.

---

## Phase 1: Upload & Initial Theme Inspection

- [ ] **Upload Theme ZIP:** Go to **Shopify Admin → Online Store → Themes → Add theme → Upload zip file** and upload `mahadev-cutlery-shopify-theme-final.zip`.
- [ ] **Verify Theme Library:** Confirm the theme appears under your Theme Library as **Mahadev Cutlery & Gift Articles — Online Store 2.0**.
- [ ] **Preview Theme:** Click `...` → **Preview** to verify the storefront loads cleanly with warm luxury styling and placeholder images.

---

## Phase 2: Create the 8 Canonical Collections

Go to **Shopify Admin → Products → Collections → Create collection**. Create each of the 8 approved departments:

- [ ] **Beauty & Makeup:** Handle: `beauty-makeup` | Condition: `Product tag is equal to department_beauty-makeup`
- [ ] **Skincare:** Handle: `skincare` | Condition: `Product tag is equal to department_skincare`
- [ ] **Haircare:** Handle: `haircare` | Condition: `Product tag is equal to department_haircare`
- [ ] **Hosiery & Innerwear:** Handle: `hosiery-innerwear` | Condition: `Product tag is equal to department_hosiery-innerwear`
- [ ] **Toys & Kids:** Handle: `toys-kids` | Condition: `Product tag is equal to department_toys-kids`
- [ ] **Gift Articles:** Handle: `gift-articles` | Condition: `Product tag is equal to department_gift-articles`
- [ ] **Imitation Jewellery:** Handle: `imitation-jewellery` | Condition: `Product tag is equal to department_imitation-jewellery`
- [ ] **Accessories & Grooming:** Handle: `accessories-grooming` | Condition: `Product tag is equal to department_accessories-grooming`

*(Note: See `data/department-collection-seed.csv` for ready-to-import collection conditions).*

---

## Phase 3: Brand & Navigation Menus

Go to **Shopify Admin → Online Store → Navigation**:

- [ ] **Main Menu (`main-menu`):** Ensure it contains links for Home (`/`), Shop All (`/collections/all`), and special offers.
- [ ] **Departments Menu (`departments-menu`):** Add links to the 8 collections created above.
- [ ] **Brands Menu (`brands-menu`):** Add links to your key brand collections (e.g. Lakmé, Maybelline, Jockey, Zoiro, etc.).
- [ ] **Footer Menu (`footer`):** Add links to your store policies and support pages.

---

## Phase 4: Store Contact & Verification Confirmation

Open **Theme Customize → Theme settings (Gear icon) → Store information**:

- [ ] **Confirm Email Address:** Verify whether `mahadevcutlery@gmail.com` is your official store contact email.
- [ ] **Confirm Phone Numbers:** Verify `9898648776` and `9998268636`.
- [ ] **Confirm WhatsApp Number:** Verify `919898648776` is active for customer orders.
- [ ] **Confirm Store Address:**
  ```
  A-15, Shivalik Bungalows, Vastral Road
  Opposite Ratanpura Gam, Vastral
  Ahmedabad, Gujarat 382418, India
  ```
- [ ] **Confirm Google Maps URL:** Verify `https://maps.app.goo.gl/P3AkDsq9bySkxAVbA`.
- [ ] **Confirm Instagram URL:** Verify `https://www.instagram.com/mahadev_cutlery/`.
- [ ] **Optional Store Hours:** Enter your physical shop opening hours (e.g. `10:00 AM – 9:00 PM, Mon–Sun`).

---

## Phase 5: Product Catalog Ingestion & Inventory Verification

- [ ] **Import Products:** Use `data/product-import-template.csv` or your completed inventory CSV via **Shopify Admin → Products → Import**.
- [ ] **Verify Real Inventory:** Ensure real SKUs, barcodes, sizes, variants, prices, and stock counts are entered. (Delete or archive any demo sample items).
- [ ] **Upload Verified Images:** Upload authentic product photos for each stocked SKU.
- [ ] **Enforce Brand Taxonomy Rules:**
  - [ ] **Zoiro:** Verify only men's innerwear/nikar items are tagged.
  - [ ] **Bodycare:** Verify no men's innerwear items are tagged (women & kids only).
  - [ ] **Lady Care:** Verify only women's innerwear items are tagged.
  - [ ] **Lotus Herbals:** Verify items are tagged under Skincare or Haircare (never Makeup).
  - [ ] **L'Oréal:** Ensure L'Oréal Paris and L'Oréal Professionnel are kept as separate vendors.
  - [ ] **Sunny & Ghar Soaps:** Stock and identity verified before publishing.
  - [ ] **No Kitchenware:** Verify zero cutlery, cookware, or kitchenware products exist.

---

## Phase 6: Store Policies, Shipping & Payments

- [ ] **Store Policies:** In **Shopify Admin → Settings → Policies**, generate or write:
  - Refund & Return Policy
  - Privacy Policy
  - Terms of Service
  - Shipping Policy
  - Contact Information
- [ ] **Shipping Zones:** In **Shopify Admin → Settings → Shipping and delivery**, set up local delivery for Ahmedabad / Gujarat and pan-India shipping rates.
- [ ] **Payment Gateways:** In **Shopify Admin → Settings → Payments**, activate your approved payment gateways (e.g. UPI, Netbanking, Cards, COD).

---

## Phase 7: Paid Gift Wrapping (Optional)

If you wish to charge for gift wrapping:
- [ ] Create a real product in **Shopify Admin → Products** titled **Gift Wrapping**.
- [ ] Set its price (e.g. ₹50 or ₹99).
- [ ] Copy its handle (e.g. `gift-wrapping`).
- [ ] In **Theme Customize → Theme settings → Gift wrapping**:
  - Check **Charge for gift wrapping**.
  - Paste the handle `gift-wrapping` into **Gift wrapping product handle**.

---

## Phase 8: Final Storefront QA & Publication

- [ ] **Perform End-to-End Test:**
  - Browse each of the 8 department collections.
  - Test product variant selection (sizes, colors).
  - Add items to the cart drawer; test quantity increase, decrease, and line removal.
  - Test WhatsApp product enquiry button on a mobile device.
  - Test checkout flow through Shopify's secure checkout.
- [ ] **Publish Theme:**
  - Go to **Shopify Admin → Online Store → Themes**.
  - Click **Publish** on **Mahadev Cutlery & Gift Articles — Online Store 2.0**.
  - Your store is now live!

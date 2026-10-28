# Shopify Theme Installation & Customization Guide
**Store:** MAHADEV CUTLERY & GIFT ARTICLES  
**Theme Name:** Mahadev Cutlery & Gift Articles — Online Store 2.0  
**Deliverable File:** `download/mahadev-cutlery-shopify-theme-final.zip` (also available at `download/mahadev-theme.zip` and `/downloads/mahadev-cutlery-shopify-theme.zip`)

---

## 1. How to Upload the Theme to Shopify Admin

1. Log in to your **Shopify Admin** dashboard (e.g. `https://admin.shopify.com/store/your-store-name`).
2. In the left navigation, click **Online Store** → **Themes**.
3. Under the **Theme library** section, click the **Add theme** dropdown button.
4. Select **Upload zip file**.
5. Click **Add file** and select `mahadev-cutlery-shopify-theme-final.zip` from your computer.
6. Click **Upload file**.
7. Shopify will unpack and validate the theme. Once uploaded, the theme appears under **Theme library** as an unpublished theme.

> [!IMPORTANT]
> **Do not publish the theme immediately.** Always keep it unpublished while you configure collections, navigation menus, and verify your real product catalog.

---

## 2. Previewing the Theme Before Publishing

1. In **Online Store** → **Themes**, locate the newly uploaded theme under **Theme library**.
2. Click the **Actions** (`...`) menu next to the theme name and select **Preview**.
3. A new browser tab will open showing the storefront preview bar with a preview link.
4. You can share this preview link with your team for internal review (the link is valid for 14 days).

---

## 3. How to Open the Theme Editor (Customize)

1. Next to the theme under **Theme library**, click the green **Customize** button.
2. The Shopify Theme Editor will load, with the storefront preview in the center and the sidebar containing **Sections** and **Theme settings** on the left.
3. Use the page selector dropdown at the very top of the editor (showing **Home page**) to navigate between different page templates (Home, Product, Collection, Cart, Pages, 404, etc.).

---

## 4. Configuring Global Theme Settings

Click the **Theme settings** icon (gear icon) in the left sidebar to configure global store settings:

### A. Brand Identity
- **Logo image:** Upload your transparent PNG or SVG logo.
- **Logo width:** Adjust slider (60px – 320px, default: 160px).
- **Store name / Logo text:** Fallback text (`MAHADEV`) used if no image logo is uploaded.
- **Logo subtitle:** Subtitle text (`CUTLERY & GIFT ARTICLES`).
- **Favicon:** Upload a 32×32px square PNG icon.

### B. Colors (Warm Editorial Palette)
- **Page background:** `#FFFFFF`
- **Soft / secondary background:** `#FAF8F5`
- **Main text:** `#20201E`
- **Muted text:** `#6F6B66`
- **Accent colour:** `#B8875A` (warm gold / terracotta)
- **Border colour:** `#EAE6E0`

### C. Layout & Radii
- **Maximum content width:** Default `1360px` (adjustable `1100px` – `1600px`).
- **Card corner radius:** Default `4px` (adjustable `0px` – `24px`).
- **Button corner radius:** Default `4px` (adjustable `0px` – `24px`).

### D. Store Information
- **Store address lines:** Pre-filled with verified address:
  ```
  A-15, Shivalik Bungalows, Vastral Road
  Opposite Ratanpura Gam, Vastral
  Ahmedabad, Gujarat 382418
  India
  ```
- **Phone 1:** `9898648776`
- **Phone 2:** `9998268636`
- **Email address:** `mahadevcutlery@gmail.com`
- **Instagram URL:** `https://www.instagram.com/mahadev_cutlery/`
- **Google Maps URL:** `https://maps.app.goo.gl/P3AkDsq9bySkxAVbA`
- **Store hours:** Optional. Leave blank to omit from footer.

### E. Commerce Presentation
- **Show vendor:** Toggle vendor name display on product cards and cart drawer.
- **Show compare-at price:** Toggle strikethrough original prices on sale items.
- **Enable wishlist:** Toggle device-local wishlist buttons and page.
- **Enable recently viewed:** Toggle recently viewed product tracking strip.

### F. WhatsApp Ordering
- **Enable WhatsApp ordering buttons:** Checked by default.
- **WhatsApp phone number:** `919898648776` (digits only with country code, no `+` sign).
- Prefills product title, selected variant, quantity, and product URL into WhatsApp chat.

### G. Gift Wrapping
- **Offer gift wrapping on product pages:** Checked by default.
- **Charge for gift wrapping:**
  - When **Unchecked** (default): Gift wrapping is offered as free to customers.
  - When **Checked**: You must create a real Shopify product named "Gift Wrapping" with its real price in Shopify Admin, then paste its handle into **Gift wrapping product handle**. The theme will add this real product to the cart at its actual price.

### H. Festival Countdown Banner
- **Festival 1 (Upcoming):** Enabled, Name: `Diwali`, Date: `2026-11-08` (Asia/Kolkata).
- **Festival 2:** Optional second festival (e.g. `Raksha Bandhan`, `2027-08-17`).
- **Auto-hide behaviour:** Automatically hides the countdown 3 days after the festival passes.

### I. Cart
- **Cart presentation mode:** Choose **Slide-out drawer** (recommended) or **Full cart page**.

---

## 5. Editing Major Homepage Sections

Under the **Sections** tab on the Home page:

1. **Announcement Bar:**
   - Edit Message 1 and Message 2.
   - Adjust autoplay interval, background color (`#20201E`), and text color (`#FAF8F5`).
2. **Header:**
   - Connect **Main menu** (default: `main-menu`).
   - Connect **Departments menu** (contains the 8 approved departments).
   - Connect **Brands menu** (links to brand collections).
   - Toggle **Show search**.
3. **Hero / Editorial Banner:**
   - Upload desktop and mobile hero images.
   - Edit Eyebrow (`Mahadev — Ahmedabad`), Heading, Supporting copy.
   - Set Primary CTA (`Shop Now` → `/collections/all`) and Secondary CTA (`Explore Brands` → `#brands-az`).
4. **Department Grid (8 Approved Departments Only):**
   - Each block links to one of the 8 canonical departments.
   - Select real collections or keep fallback handles:
     `beauty-makeup`, `skincare`, `haircare`, `hosiery-innerwear`, `toys-kids`, `gift-articles`, `imitation-jewellery`, `accessories-grooming`.
5. **Featured Brands:**
   - Up to 12 featured brand blocks with logos/images and collection links.
6. **Trending Products & New Arrivals:**
   - Select the Shopify collection to feature.
   - Set product limit (e.g. 4 to 8) and column counts.
   - If collection is empty, an honest empty state is shown.
7. **Product Types Navigation:**
   - 11 circular navigation chips linking directly to product type searches/collections.
8. **Editorial Story Sections (Edits):**
   - High-end split editorial layout with image, headline, paragraph, and product pills.
9. **Gift Finder:**
   - 3-step interactive finder (Occasion → Recipient → Budget).
   - Select source collection for gift recommendations.
10. **Budget & Occasion Cards:**
    - Visual cards for specific budgets (`Under ₹299`, `Under ₹499`, `Premium Gifting`).
11. **Brands A–Z Directory:**
    - Interactive 30-brand searchable alphabetical directory.
12. **Newsletter:**
    - Native Shopify customer newsletter signup form with success message.
13. **Footer:**
    - Footer navigation menus, contact details, social links, and copyright text.

---

## 6. Creating the Required Shopify Collections

To make all theme links work immediately on your live store, create these 8 collections in **Shopify Admin** → **Products** → **Collections**:

| Collection Title | Handle | Type | Automated Condition / Rule |
|---|---|---|---|
| Beauty & Makeup | `beauty-makeup` | Automated | `Product tag` equals `department_beauty-makeup` |
| Skincare | `skincare` | Automated | `Product tag` equals `department_skincare` |
| Haircare | `haircare` | Automated | `Product tag` equals `department_haircare` |
| Hosiery & Innerwear | `hosiery-innerwear` | Automated | `Product tag` equals `department_hosiery-innerwear` |
| Toys & Kids | `toys-kids` | Automated | `Product tag` equals `department_toys-kids` |
| Gift Articles | `gift-articles` | Automated | `Product tag` equals `department_gift-articles` |
| Imitation Jewellery | `imitation-jewellery` | Automated | `Product tag` equals `department_imitation-jewellery` |
| Accessories & Grooming | `accessories-grooming` | Automated | `Product tag` equals `department_accessories-grooming` |

*(Refer to `data/department-collection-seed.csv` for ready-to-import collection conditions).*

---

## 7. Importing Your Product Catalogue

1. Go to **Shopify Admin** → **Products**.
2. Click **Import**.
3. Use `data/product-import-template.csv` or your completed product spreadsheet.
4. Verify that:
   - Every product has the correct department tag (e.g. `department_skincare`).
   - Every vendor matches the canonical brand spelling (e.g. `Lakmé`, `L'Oréal Paris`, `L'Oréal Professionnel`, `Zoiro`).
   - Zoiro products are men's innerwear only.
   - Bodycare products contain no men's lines.
   - No kitchenware or cutlery shopping products are created.

---

## 8. Final Publishing Steps

Once all collections, menus, and products are verified in Theme Preview:
1. Go to **Online Store** → **Themes**.
2. Click **Publish** next to **Mahadev Cutlery & Gift Articles**.
3. Confirm publication.
4. Your genuine Shopify Online Store 2.0 storefront is now live!

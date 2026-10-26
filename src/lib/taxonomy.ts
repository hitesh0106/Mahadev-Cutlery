// ─────────────────────────────────────────────────────────────────────────────
// OFFICIAL STORE TAXONOMY — MAHADEV CUTLERY & GIFT ARTICLES
// Single source of truth for the eight approved departments, the 30 supported
// brands with their classification rules, and the tag conventions.
//
// ⚠️ HONESTY RULES:
// - This is a CLASSIFICATION system, not a product list. A brand appearing here
//   does NOT mean the store stocks it — brands go live only with at least one
//   verified stocked product (see verificationStatus).
// - No kitchenware/cutlery department exists, by explicit decision.
// - Never invent products, prices, stock, ratings or discounts.
//
// Mirrored in: data/brand-department-map.csv, data/department-collection-seed.csv,
// docs/BRAND_DEPARTMENT_MAP.md, docs/PRODUCT_TAXONOMY.md (validated by
// scripts/validate-catalog.ts — keep all copies in sync).
// ─────────────────────────────────────────────────────────────────────────────

export type DepartmentHandle =
  | 'beauty-makeup'
  | 'skincare'
  | 'haircare'
  | 'hosiery-innerwear'
  | 'toys-kids'
  | 'gift-articles'
  | 'imitation-jewellery'
  | 'accessories-grooming';

export type Department = {
  name: string;
  handle: DepartmentHandle;
  blurb: string;
  types: string[];
  /** Filter recommendations (Shopify Search & Discovery — data-driven only). */
  filters: string[];
};

/** The EXACTLY eight approved departments. Never add a ninth without approval. */
export const DEPARTMENTS_EIGHT: Department[] = [
  {
    name: 'Beauty & Makeup',
    handle: 'beauty-makeup',
    blurb: 'Lips, eyes, face — cosmetics',
    types: [
      'Face makeup', 'Foundation', 'Concealer', 'Compact powder', 'Loose powder',
      'Primer', 'Blush', 'Highlighter', 'Contour products', 'Makeup setting spray',
      'Lipstick', 'Lip gloss', 'Lip liner', 'Kajal', 'Eyeliner', 'Mascara',
      'Eyeshadow', 'Eyebrow products', 'Makeup remover', 'Makeup brushes',
      'Makeup sponges', 'Cosmetic accessories',
    ],
    filters: ['Brand', 'Product type', 'Price', 'Availability', 'Colour (where variant colour exists)'],
  },
  {
    name: 'Skincare',
    handle: 'skincare',
    blurb: 'Cleanse, treat, protect',
    types: [
      'Face cleanser', 'Face wash', 'Moisturizer', 'Face cream', 'Sunscreen',
      'Serum', 'Toner', 'Face mask', 'Sheet mask', 'Exfoliating products',
      'Lip balm', 'Eye cream', 'Body lotion', 'Body cream', 'Hand cream',
      'Facial-care products',
    ],
    filters: ['Brand', 'Product type', 'Price', 'Availability'],
  },
  {
    name: 'Haircare',
    handle: 'haircare',
    blurb: 'Everyday & professional care',
    types: [
      'Shampoo', 'Conditioner', 'Hair mask', 'Hair serum', 'Hair oil',
      'Hair styling products', 'Hair colour', 'Hair treatment products',
      'Hair brushes', 'Combs', 'Hair dryers', 'Hair straighteners',
      'Hair styling tools', 'Hair accessories',
    ],
    filters: ['Brand', 'Product type', 'Price', 'Availability'],
  },
  {
    name: 'Hosiery & Innerwear',
    handle: 'hosiery-innerwear',
    blurb: 'Men, women & kids',
    types: [
      "Men's underwear/nikar", "Women's underwear/nikar/panties", "Women's innerwear",
      "Children's innerwear", 'Vests', 'Undergarments', 'Socks', 'Leggings',
      'Other verified hosiery products',
    ],
    filters: ['Brand', 'Customer group', 'Size', 'Price', 'Availability'],
  },
  {
    name: 'Toys & Kids',
    handle: 'toys-kids',
    blurb: 'Play & learn',
    types: [
      'Toys', 'Dolls', 'Toy vehicles', 'Educational toys', 'Soft toys', 'Games',
      "Children's accessories", 'Other verified children\'s products',
    ],
    filters: ['Brand', 'Product type', 'Price', 'Availability', 'Age range (only when verified age data exists)'],
  },
  {
    name: 'Gift Articles',
    handle: 'gift-articles',
    blurb: 'For every occasion',
    types: [
      'Gift sets', 'Decorative gifts', 'Birthday gifts', 'Festival gifts',
      'Wedding gifts', 'Anniversary gifts', 'Greeting cards', 'Gift packaging',
      'Gift boxes', 'Other verified gift articles',
    ],
    filters: ['Product type', 'Price', 'Availability', 'Occasion (tag-based, where tagged)'],
  },
  {
    name: 'Imitation Jewellery',
    handle: 'imitation-jewellery',
    blurb: 'Everyday sparkle',
    types: [
      'Earrings', 'Necklaces', 'Chains', 'Bangles', 'Bracelets', 'Rings',
      'Jewellery sets', 'Pendants', 'Other verified imitation jewellery',
    ],
    filters: ['Product type', 'Colour (where variant colour exists)', 'Price', 'Availability'],
  },
  {
    name: 'Accessories & Grooming',
    handle: 'accessories-grooming',
    blurb: 'Grooming, tools, belts, eyewear, perfume',
    types: [
      'Grooming accessories', 'Hair accessories', 'Beauty tools', 'Brushes',
      'Combs', 'Hair dryers', 'Hair straighteners', 'Selected personal-care accessories',
      'Belts', 'Goggles', 'Perfume', 'Other verified miscellaneous accessories',
    ],
    filters: ['Brand', 'Product type', 'Price', 'Availability'],
  },
];

export const DEPARTMENT_NAMES = DEPARTMENTS_EIGHT.map((d) => d.name);

// ── Brand profiles ───────────────────────────────────────────────────────────

export type VerificationStatus =
  | 'rule-verified' // classification rule confirmed by owner; stock still per-product
  | 'stock-verification-required' // every product needs owner confirmation before publishing
  | 'identity-unverified'; // brand identity itself pending — publish nothing yet

export type BrandProfile = {
  brand: string;
  /** Approved primary department(s) — actual product decides between them. */
  primaryDepartments: string[];
  allowedTypes: string[];
  allowedAudiences: string[];
  /** Explicitly forbidden classifications. */
  prohibited: string[];
  verification: VerificationStatus;
  notes: string;
};

export const BRANDS: BrandProfile[] = [
  // ── Hosiery & Innerwear ────────────────────────────────────────────────────
  {
    brand: 'Jockey',
    primaryDepartments: ['Hosiery & Innerwear'],
    allowedTypes: ["Men's underwear", "Men's vests", "Men's innerwear", "Women's innerwear", "Women's underwear", "Women's sleepwear/loungewear (if stocked)", 'Socks', 'Other genuine Jockey apparel/innerwear'],
    allowedAudiences: ['Men', 'Women'],
    prohibited: ['Classifying unverified categories', 'Kids lines unless actually stocked'],
    verification: 'rule-verified',
    notes: 'Collections only for real stock: Jockey, Jockey Men\'s Innerwear, Jockey Women\'s Innerwear, Jockey Socks.',
  },
  {
    brand: 'Van Heusen',
    primaryDepartments: ['Hosiery & Innerwear'],
    allowedTypes: ["Men's underwear", "Men's innerwear", 'Vests', "Women's innerwear (if stocked)", 'Other verified products actually sold'],
    allowedAudiences: ['Men', 'Women (if stocked)'],
    prohibited: ['Assuming every product is innerwear — use the actual product type'],
    verification: 'rule-verified',
    notes: 'The actual product type decides the department; do not force innerwear.',
  },
  {
    brand: 'Zoiro',
    primaryDepartments: ['Hosiery & Innerwear'],
    allowedTypes: ["Men's nikar/underwear", 'Other verified men\'s innerwear items (if stocked and confirmed)'],
    allowedAudiences: ['Men'],
    prohibited: ["Women's Zoiro collection", "Girls' Zoiro collection", "Boys' Zoiro collection", 'Unverified Zoiro product types'],
    verification: 'rule-verified',
    notes: 'MANDATORY: Zoiro is men\'s nikar/innerwear ONLY in this store.',
  },
  {
    brand: 'Bodycare',
    primaryDepartments: ['Hosiery & Innerwear'],
    allowedTypes: ["Women's innerwear", "Girls' innerwear", "Boys' innerwear", "Children's hosiery products", 'Other verified women\'s/children\'s products'],
    allowedAudiences: ['Women', 'Girls', 'Boys'],
    prohibited: ["Bodycare Men's", "Men's Bodycare Innerwear", 'Any men\'s category', 'Confusing children\'s products with women\'s products'],
    verification: 'rule-verified',
    notes: 'MANDATORY: women + children only. Separate collections only where real products support them.',
  },
  {
    brand: 'Lady Care',
    primaryDepartments: ['Hosiery & Innerwear'],
    allowedTypes: ["Women's nikar/panty", "Women's innerwear products (when confirmed)"],
    allowedAudiences: ['Women'],
    prohibited: ["Men's products", "Boys' products", "Girls' products (unless merchant explicitly verifies and revises the rule)"],
    verification: 'rule-verified',
    notes: 'MANDATORY: women\'s nikar/panty and verified women\'s innerwear only.',
  },
  // ── Beauty & Makeup ────────────────────────────────────────────────────────
  {
    brand: 'Swiss Beauty',
    primaryDepartments: ['Beauty & Makeup', 'Accessories & Grooming (tools only)'],
    allowedTypes: ['Foundation', 'Concealer', 'Compact', 'Blush', 'Highlighter', 'Lipstick', 'Lip gloss', 'Lip liner', 'Kajal', 'Eyeliner', 'Mascara', 'Eyeshadow', 'Primer', 'Makeup setting products', 'Makeup brushes', 'Sponges', 'Other verified cosmetics'],
    allowedAudiences: ['Women', 'Unisex (tools)'],
    prohibited: ['Assuming every Swiss Beauty product is available'],
    verification: 'rule-verified',
    notes: 'Cosmetics → Beauty & Makeup; suitable tools → Accessories & Grooming.',
  },
  {
    brand: 'Lakmé',
    primaryDepartments: ['Beauty & Makeup', 'Skincare'],
    allowedTypes: ['Foundation', 'Concealer', 'Compact', 'Lipstick', 'Lip gloss', 'Kajal', 'Eyeliner', 'Mascara', 'Blush', 'Makeup primer', 'Sunscreen', 'Moisturizer', 'Face wash', 'Other verified skincare/makeup'],
    allowedAudiences: ['Women', 'Unisex (skincare)'],
    prohibited: ['Classifying skincare products as makeup merely because they are Lakmé'],
    verification: 'rule-verified',
    notes: 'Cosmetics → Beauty & Makeup; skincare → Skincare. Actual product identity decides.',
  },
  {
    brand: 'Maybelline New York',
    primaryDepartments: ['Beauty & Makeup'],
    allowedTypes: ['Foundation', 'Concealer', 'Powder', 'Mascara', 'Eyeliner', 'Kajal', 'Lipstick', 'Lip gloss', 'Lip liner', 'Blush', 'Other verified cosmetics'],
    allowedAudiences: ['Women'],
    prohibited: ['Importing/publishing non-stocked products'],
    verification: 'rule-verified',
    notes: 'Only import and publish actual stocked products.',
  },
  {
    brand: 'Faces Canada',
    primaryDepartments: ['Beauty & Makeup', 'Accessories & Grooming (tools only)'],
    allowedTypes: ['Lipstick', 'Lip gloss', 'Lip liner', 'Foundation', 'Concealer', 'Compact', 'Kajal', 'Eyeliner', 'Mascara', 'Nail products', 'Makeup tools', 'Other verified beauty products'],
    allowedAudiences: ['Women'],
    prohibited: ['Tools classified as cosmetics'],
    verification: 'rule-verified',
    notes: 'Cosmetics → Beauty & Makeup; tools → Accessories & Grooming.',
  },
  {
    brand: 'Colorbar',
    primaryDepartments: ['Beauty & Makeup'],
    allowedTypes: ['Lipstick', 'Lip gloss', 'Foundation', 'Concealer', 'Blush', 'Highlighter', 'Kajal', 'Eyeliner', 'Mascara', 'Nail products', 'Makeup tools', 'Other verified cosmetics'],
    allowedAudiences: ['Women'],
    prohibited: ['Unverified product types'],
    verification: 'rule-verified',
    notes: 'Primary department Beauty & Makeup for cosmetics.',
  },
  {
    brand: 'MARS Cosmetics',
    primaryDepartments: ['Beauty & Makeup'],
    allowedTypes: ['Lip products', 'Face makeup', 'Eye makeup', 'Makeup palettes', 'Brushes', 'Sponges', 'Other verified makeup products'],
    allowedAudiences: ['Women'],
    prohibited: ['Classifying unverified products'],
    verification: 'rule-verified',
    notes: 'Display alias "MARS" acceptable on cards; keep ONE canonical vendor spelling for imports.',
  },
  // ── Skincare & personal care ───────────────────────────────────────────────
  {
    brand: 'Minimalist',
    primaryDepartments: ['Skincare'],
    allowedTypes: ['Face serums', 'Cleansers', 'Moisturizers', 'Sunscreens', 'Toners', 'Other verified skincare products'],
    allowedAudiences: ['Unisex'],
    prohibited: ['Inventing active-ingredient concentrations', 'Medical claims', 'Skin-condition suitability claims'],
    verification: 'rule-verified',
    notes: 'Use accurate product descriptions only.',
  },
  {
    brand: 'Dot & Key',
    primaryDepartments: ['Skincare'],
    allowedTypes: ['Face cleansers', 'Moisturizers', 'Serums', 'Sunscreens', 'Face masks', 'Lip-care products', 'Other verified skincare products'],
    allowedAudiences: ['Unisex', 'Women'],
    prohibited: ['Classifying all products as makeup'],
    verification: 'rule-verified',
    notes: 'Primary department Skincare.',
  },
  {
    brand: 'Cetaphil',
    primaryDepartments: ['Skincare'],
    allowedTypes: ['Cleansers', 'Moisturizers', 'Face-care products', 'Body-care products', 'Sunscreens', 'Other verified personal-care products'],
    allowedAudiences: ['Unisex'],
    prohibited: ['Unverified product-specific claims'],
    verification: 'rule-verified',
    notes: 'Use only verified product descriptions.',
  },
  {
    brand: 'Sebamed',
    primaryDepartments: ['Skincare'],
    allowedTypes: ['Cleansers', 'Moisturizers', 'Face-care products', 'Body-care products', 'Other verified skincare products'],
    allowedAudiences: ['Unisex'],
    prohibited: ['Unverified claims'],
    verification: 'rule-verified',
    notes: 'Primary department Skincare.',
  },
  {
    brand: "POND'S",
    primaryDepartments: ['Skincare'],
    allowedTypes: ['Face wash', 'Face cream', 'Moisturizer', 'Cleansing products', 'Other verified skincare products'],
    allowedAudiences: ['Unisex', 'Women'],
    prohibited: ['Classifying products as makeup unless the item is actually cosmetic'],
    verification: 'rule-verified',
    notes: 'Primary department Skincare.',
  },
  {
    brand: 'NIVEA',
    primaryDepartments: ['Skincare', 'Accessories & Grooming (per actual product)'],
    allowedTypes: ['Body lotion', 'Cream', 'Moisturizer', 'Lip balm', 'Deodorant', 'Body-care products', 'Other verified personal-care products'],
    allowedAudiences: ['Unisex', 'Men', 'Women'],
    prohibited: ['Inventing product availability'],
    verification: 'rule-verified',
    notes: 'Department depends on the actual product within the approved structure.',
  },
  {
    brand: 'Garnier',
    primaryDepartments: ['Skincare', 'Haircare'],
    allowedTypes: ['Face wash', 'Cleansers', 'Moisturizers', 'Sunscreens', 'Haircare', 'Hair colour', 'Other verified skincare/haircare'],
    allowedAudiences: ['Unisex', 'Women'],
    prohibited: ['Duplicating products just to place them in two collections'],
    verification: 'rule-verified',
    notes: 'Skincare → Skincare; hair products → Haircare. Keep one brand spelling.',
  },
  {
    brand: 'Pilgrim',
    primaryDepartments: ['Skincare', 'Haircare'],
    allowedTypes: ['Skincare', 'Face serums', 'Cleansers', 'Moisturizers', 'Haircare', 'Hair serums', 'Other verified beauty products'],
    allowedAudiences: ['Unisex', 'Women'],
    prohibited: ['Assuming department without product identity'],
    verification: 'rule-verified',
    notes: 'Classify according to actual product identity.',
  },
  {
    brand: 'Plix',
    primaryDepartments: ['Skincare'],
    allowedTypes: ['Skincare', 'Face-care products', 'Body-care products', 'Other verified beauty/personal-care products'],
    allowedAudiences: ['Unisex', 'Women'],
    prohibited: ['Auto-classifying as skincare when the actual use differs'],
    verification: 'rule-verified',
    notes: 'Follow the actual intended use.',
  },
  {
    brand: 'Lotus Herbals',
    primaryDepartments: ['Skincare'],
    allowedTypes: ['Skincare', 'Face care', 'Sunscreen', 'Cleansing products', 'Moisturizers', 'Other verified personal-care products', 'Individual cosmetics (classified correctly per product)'],
    allowedAudiences: ['Unisex', 'Women'],
    prohibited: ['Automatically classifying the brand as makeup', 'Assigning the whole brand to makeup'],
    verification: 'rule-verified',
    notes: 'MANDATORY: never default to makeup. If an actual stocked item is a cosmetic, classify that ONE product correctly.',
  },
  // ── L'Oréal (two separate brands) ──────────────────────────────────────────
  {
    brand: "L'Oréal Paris",
    primaryDepartments: ['Haircare', 'Skincare', 'Beauty & Makeup'],
    allowedTypes: ['Hair shampoo', 'Conditioner', 'Hair serum', 'Hair colour', 'Haircare products', 'Face-care products', 'Skincare products', 'Makeup products', 'Other verified products'],
    allowedAudiences: ['Unisex', 'Women'],
    prohibited: ['Merging with L\'Oréal Professionnel (vendor names, collection handles, imports)', 'Dumping every product into one department'],
    verification: 'rule-verified',
    notes: 'SEPARATE brand from L\'Oréal Professionnel. Department follows the actual product.',
  },
  {
    brand: "L'Oréal Professionnel",
    primaryDepartments: ['Haircare'],
    allowedTypes: ['Professional shampoo', 'Conditioner', 'Hair masks', 'Hair serum', 'Hair treatments', 'Hair styling products', 'Other verified professional haircare products'],
    allowedAudiences: ['Unisex'],
    prohibited: ['Makeup or skincare collections (unless real catalogue supports them)', 'Merging with L\'Oréal Paris'],
    verification: 'rule-verified',
    notes: 'SEPARATE brand. Professional haircare only.',
  },
  // ── Haircare ───────────────────────────────────────────────────────────────
  {
    brand: 'Matrix',
    primaryDepartments: ['Haircare'],
    allowedTypes: ['Shampoo', 'Conditioner', 'Hair masks', 'Hair serum', 'Hair treatments', 'Hair styling products', 'Hair colour products (if stocked)', 'Other verified haircare'],
    allowedAudiences: ['Unisex'],
    prohibited: ['Unverified professional claims'],
    verification: 'rule-verified',
    notes: 'Primary department Haircare.',
  },
  {
    brand: 'Wella Professionals',
    primaryDepartments: ['Haircare'],
    allowedTypes: ['Shampoo', 'Conditioner', 'Hair masks', 'Hair treatments', 'Hair styling products', 'Hair colour products (if stocked)', 'Other verified professional haircare'],
    allowedAudiences: ['Unisex'],
    prohibited: ['Publishing professional product claims without verified information'],
    verification: 'rule-verified',
    notes: 'Primary department Haircare.',
  },
  // ── Tools & appliances ─────────────────────────────────────────────────────
  {
    brand: 'VEGA',
    primaryDepartments: ['Accessories & Grooming', 'Haircare (related collections where appropriate)'],
    allowedTypes: ['Hair brushes', 'Combs', 'Hair dryers', 'Hair straighteners', 'Hair styling tools', 'Grooming tools', 'Beauty tools', 'Other verified accessories'],
    allowedAudiences: ['Unisex', 'Women'],
    prohibited: ['Assuming a department from the brand alone — use the actual product type'],
    verification: 'rule-verified',
    notes: 'Actual product type decides the primary department.',
  },
  {
    brand: 'Philips',
    primaryDepartments: ['Accessories & Grooming'],
    allowedTypes: ['Hair dryers', 'Hair straighteners', 'Trimmers', 'Grooming devices', 'Personal-care appliances', 'Other verified products (when stocked)'],
    allowedAudiences: ['Unisex', 'Men'],
    prohibited: ['Inventing models', 'Electrical specifications', 'Warranty terms', 'Availability'],
    verification: 'rule-verified',
    notes: 'Only when actually stocked; never invent specifications.',
  },
  // ── Restricted / pending ───────────────────────────────────────────────────
  {
    brand: 'Sunny',
    primaryDepartments: ['Per actual verified product'],
    allowedTypes: ['Only confirmed products actually stocked by the owner'],
    allowedAudiences: ['Per verified product'],
    prohibited: ['Assuming a product type from the brand name alone', 'Publishing unverified products'],
    verification: 'stock-verification-required',
    notes: 'Every Sunny product needs: name, category, customer group, price, image and inventory confirmed before publishing.',
  },
  {
    brand: 'Ghar Soaps',
    primaryDepartments: ['Per actual verified product'],
    allowedTypes: ['Only products from the verified catalogue of the confirmed manufacturer'],
    allowedAudiences: ['Per verified product'],
    prohibited: ['Assuming brand identity from the name', 'Treating similarly named brands as the same company', 'Inventing products'],
    verification: 'identity-unverified',
    notes: 'Verify exact brand identity, product names, packaging, sizes, prices, images, claims and inventory. Keep unpublished until the merchant confirms.',
  },
];

/** Canonical vendor spelling list (30 brands incl. O3+ from the store's list). */
export const ALL_VENDORS: string[] = [...BRANDS.map((b) => b.brand), 'O3+'].sort((a, b) =>
  a.localeCompare(b),
);

// ── Tag conventions (PART 4) ─────────────────────────────────────────────────

export const TAG_CONVENTIONS: { prefix: string; example: string; meaning: string }[] = [
  { prefix: 'department_', example: 'department_skincare', meaning: 'Primary department (one per product)' },
  { prefix: 'audience_', example: 'audience_women', meaning: 'Verified customer group' },
  { prefix: 'type_', example: 'type_face_wash', meaning: 'Product type (snake_case of Type)' },
  { prefix: 'brand_', example: 'brand_jockey', meaning: 'Brand slug' },
  { prefix: 'gf-oc-', example: 'gf-oc-diwali', meaning: 'Gift Finder occasion' },
  { prefix: 'gf-for-', example: 'gf-for-her', meaning: 'Gift Finder recipient' },
  { prefix: 'gf-', example: 'gf-199-499', meaning: 'Gift Finder budget band' },
];

export const AUDIENCE_TAGS = [
  'audience_men',
  'audience_women',
  'audience_boys',
  'audience_girls',
  'audience_unisex',
];

export function departmentTag(name: string): string {
  return `department_${name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '')}`;
}

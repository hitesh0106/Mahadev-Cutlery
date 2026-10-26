// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE / DEMO CATALOGUE — Mahadev Cutlery & Gift Articles
// ⚠️ Every item here is explicitly a SAMPLE used only for design demonstration
//    in the Next.js showcase. These are NOT real store products, prices or
//    stock levels and are excluded from the production catalogue.
//    The real catalogue lives exclusively in Shopify after the owner imports
//    actual products (see /api/products-csv template + docs/PRODUCT_IMPORT.md).
//
// Classification follows src/lib/taxonomy.ts — the EIGHT approved departments
// and the 30 brand profiles. Brand rules enforced:
// - Zoiro: men's nikar/innerwear only. Bodycare: kids-boys/kids-girls/women only.
// - Lady Care: women's nikar/panty only. Lotus Herbals: never auto-classified as makeup.
// - L'Oréal Paris and L'Oréal Professionnel kept separate (canonical spellings).
// - NO kitchenware/cutlery department exists anywhere.
// - No discounts, no ratings, no fake scarcity.
// ─────────────────────────────────────────────────────────────────────────────

import { BRANDS, DEPARTMENTS_EIGHT } from './taxonomy';

export type DemoProduct = {
  id: string;
  handle: string;
  title: string;
  brand: string; // vendor — "Generic (Sample)" for unbranded demo items
  department: string;
  subcategory: string;
  type: string;
  tags: string[];
  priceInr: number; // SAMPLE price for UI demonstration only
  compareAtInr: number | null; // always null — no invented discounts
  available: boolean;
  sizes: string[];
  colors: string[];
  image: string;
  url: string; // theme-style product URL
  gfTags: string[]; // gift-finder tags, mirrors theme tag conventions
  giftWrapEligible: boolean;
  isSample: true;
};

/**
 * The EIGHT approved departments with their Shopify collection handles.
 * There is deliberately NO kitchenware/cutlery department.
 */
export const DEPARTMENTS = [
  { name: 'Beauty & Makeup', handle: 'beauty-makeup', image: '/images/dept-makeup.jpg', blurb: 'Lips, eyes, face — cosmetics' },
  { name: 'Skincare', handle: 'skincare', image: '/images/dept-beauty.jpg', blurb: 'Cleanse, treat, protect' },
  { name: 'Haircare', handle: 'haircare', image: '/images/dept-haircare.jpg', blurb: 'Everyday & professional care' },
  { name: 'Hosiery & Innerwear', handle: 'hosiery-innerwear', image: '/images/dept-innerwear.jpg', blurb: 'Comfort for every day' },
  { name: 'Toys & Kids', handle: 'toys-kids', image: '/images/dept-kids.jpg', blurb: 'Playful picks for little ones' },
  { name: 'Gift Articles', handle: 'gift-articles', image: '/images/dept-gifts.jpg', blurb: 'Thoughtful gifts for every occasion' },
  { name: 'Imitation Jewellery', handle: 'imitation-jewellery', image: '/images/dept-jewellery.jpg', blurb: 'Everyday sparkle' },
  { name: 'Accessories & Grooming', handle: 'accessories-grooming', image: '/images/dept-tools.jpg', blurb: 'Grooming, tools, belts, eyewear, perfume' },
] as const;

void DEPARTMENTS_EIGHT;

/** Brand rules shown on the XLSX Reference sheet — one row per profile. */
export const BRAND_RULES: { brand: string; rule: string }[] = BRANDS.map((b) => ({
  brand: b.brand,
  rule: `${b.notes}${b.prohibited.length ? ` Never: ${b.prohibited.join('; ')}.` : ''}`,
}));

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'mc-001', handle: 'sample-zoiro-mens-nikar-vest',
    title: 'Zoiro Men’s Cotton Nikar Vest — SAMPLE',
    brand: 'Zoiro', department: 'Hosiery & Innerwear', subcategory: "Men's Innerwear", type: "Men's Nikar",
    tags: ['brand_zoiro', 'audience_men', 'type_mens_nikar', 'department_hosiery_innerwear'],
    priceInr: 249, compareAtInr: null, available: true,
    sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Grey', 'Black'],
    image: '/images/dept-innerwear.jpg', url: '/products/sample-zoiro-mens-nikar-vest',
    gfTags: ['gf-for-him', 'gf-199-499'], giftWrapEligible: false, isSample: true,
  },
  {
    id: 'mc-002', handle: 'sample-bodycare-women-panty-3pk',
    title: 'Bodycare Women’s Cotton Panty (Pack of 3) — SAMPLE',
    brand: 'Bodycare', department: 'Hosiery & Innerwear', subcategory: 'Women', type: 'Panty',
    tags: ['brand_bodycare', 'audience_women', 'type_panty', 'department_hosiery_innerwear'],
    priceInr: 299, compareAtInr: null, available: true,
    sizes: ['Free Size'], colors: ['Assorted'],
    image: '/images/dept-innerwear.jpg', url: '/products/sample-bodycare-women-panty-3pk',
    gfTags: ['gf-for-her', 'gf-199-499'], giftWrapEligible: false, isSample: true,
  },
  {
    id: 'mc-003', handle: 'sample-bodycare-boys-vest-2pk',
    title: 'Bodycare Kids Boys Vest (Pack of 2) — SAMPLE',
    brand: 'Bodycare', department: 'Hosiery & Innerwear', subcategory: 'Kids — Boys', type: 'Kids Vest',
    tags: ['brand_bodycare', 'audience_boys', 'type_kids_vest', 'department_hosiery_innerwear'],
    priceInr: 199, compareAtInr: null, available: true,
    sizes: ['4-5Y', '6-7Y', '8-9Y'], colors: ['Assorted'],
    image: '/images/dept-innerwear.jpg', url: '/products/sample-bodycare-boys-vest-2pk',
    gfTags: ['gf-for-kids', 'gf-under-199'], giftWrapEligible: false, isSample: true,
  },
  {
    id: 'mc-004', handle: 'sample-bodycare-girls-bloomer',
    title: 'Bodycare Kids Girls Bloomer — SAMPLE',
    brand: 'Bodycare', department: 'Hosiery & Innerwear', subcategory: 'Kids — Girls', type: 'Kids Bloomer',
    tags: ['brand_bodycare', 'audience_girls', 'type_kids_bloomer', 'department_hosiery_innerwear'],
    priceInr: 189, compareAtInr: null, available: false, // demonstrates sold-out state
    sizes: ['2-3Y', '4-5Y', '6-7Y'], colors: ['Assorted'],
    image: '/images/dept-innerwear.jpg', url: '/products/sample-bodycare-girls-bloomer',
    gfTags: ['gf-for-kids', 'gf-under-199'], giftWrapEligible: false, isSample: true,
  },
  {
    id: 'mc-005', handle: 'sample-ladycare-women-nikar',
    title: 'Lady Care Women’s Cotton Nikar — SAMPLE',
    brand: 'Lady Care', department: 'Hosiery & Innerwear', subcategory: 'Women', type: "Women's Nikar",
    tags: ['brand_lady_care', 'audience_women', 'type_womens_nikar', 'department_hosiery_innerwear'],
    priceInr: 159, compareAtInr: null, available: true,
    sizes: ['M', 'L', 'XL'], colors: ['Assorted'],
    image: '/images/dept-innerwear.jpg', url: '/products/sample-ladycare-women-nikar',
    gfTags: ['gf-for-her', 'gf-under-199'], giftWrapEligible: false, isSample: true,
  },
  {
    id: 'mc-006', handle: 'sample-jockey-mens-vest',
    title: 'Jockey Men’s Vest — SAMPLE',
    brand: 'Jockey', department: 'Hosiery & Innerwear', subcategory: "Men's Innerwear", type: 'Vest',
    tags: ['brand_jockey', 'audience_men', 'type_vest', 'department_hosiery_innerwear'],
    priceInr: 349, compareAtInr: null, available: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Grey'],
    image: '/images/dept-innerwear.jpg', url: '/products/sample-jockey-mens-vest',
    gfTags: ['gf-for-him', 'gf-199-499'], giftWrapEligible: false, isSample: true,
  },
  {
    id: 'mc-007', handle: 'sample-lotus-herbals-face-wash',
    title: 'Lotus Herbals Gentle Face Wash — SAMPLE',
    brand: 'Lotus Herbals', department: 'Skincare', subcategory: 'Face Care', type: 'Face Wash',
    tags: ['brand_lotus_herbals', 'type_face_wash', 'department_skincare'],
    priceInr: 285, compareAtInr: null, available: true,
    sizes: ['120 ml'], colors: [],
    image: '/images/dept-beauty.jpg', url: '/products/sample-lotus-herbals-face-wash',
    gfTags: ['gf-for-her', 'gf-199-499', 'gf-oc-diwali'], giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-008', handle: 'sample-loreal-paris-hair-serum',
    title: 'L’Oréal Paris Hair Serum — SAMPLE',
    brand: "L'Oréal Paris", department: 'Haircare', subcategory: 'Hair Treatment', type: 'Hair Serum',
    tags: ['brand_loreal_paris', 'type_hair_serum', 'department_haircare'],
    priceInr: 449, compareAtInr: null, available: true,
    sizes: ['100 ml'], colors: [],
    image: '/images/dept-haircare.jpg', url: '/products/sample-loreal-paris-hair-serum',
    gfTags: ['gf-for-her', 'gf-199-499', 'gf-oc-diwali'], giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-009', handle: 'sample-loreal-professionnel-shampoo',
    title: 'L’Oréal Professionnel Salon Shampoo — SAMPLE',
    brand: "L'Oréal Professionnel", department: 'Haircare', subcategory: 'Shampoo', type: 'Shampoo',
    tags: ['brand_loreal_professionnel', 'type_shampoo', 'department_haircare'],
    priceInr: 640, compareAtInr: null, available: true,
    sizes: ['300 ml'], colors: [],
    image: '/images/dept-haircare.jpg', url: '/products/sample-loreal-professionnel-shampoo',
    gfTags: ['gf-for-her', 'gf-for-family', 'gf-500-999'], giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-010', handle: 'sample-lakme-lip-colour',
    title: 'Lakmé Lip Colour — SAMPLE',
    brand: 'Lakmé', department: 'Beauty & Makeup', subcategory: 'Lips', type: 'Lip Product',
    tags: ['brand_lakme', 'type_lip_product', 'department_beauty_makeup'],
    priceInr: 399, compareAtInr: null, available: true,
    sizes: ['4 g'], colors: ['Warm Nude', 'Rose', 'Coral'],
    image: '/images/dept-makeup.jpg', url: '/products/sample-lakme-lip-colour',
    gfTags: ['gf-for-her', 'gf-199-499', 'gf-oc-diwali', 'gf-oc-birthday'], giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-011', handle: 'sample-vega-hair-brush',
    title: 'VEGA Hair Brush — SAMPLE',
    brand: 'VEGA', department: 'Accessories & Grooming', subcategory: 'Brushes & Combs', type: 'Hair Brush',
    tags: ['brand_vega', 'type_hair_brush', 'department_accessories_grooming'],
    priceInr: 175, compareAtInr: null, available: true,
    sizes: [], colors: ['Ivory'],
    image: '/images/dept-tools.jpg', url: '/products/sample-vega-hair-brush',
    gfTags: ['gf-for-her', 'gf-under-199'], giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-012', handle: 'sample-gift-hamper-set',
    title: 'Decorative Gift Hamper Set — SAMPLE',
    brand: 'Generic (Sample)', department: 'Gift Articles', subcategory: 'Gift Sets', type: 'Gift Set',
    tags: ['type_gift_set', 'department_gift_articles'],
    priceInr: 899, compareAtInr: null, available: true,
    sizes: [], colors: [],
    image: '/images/dept-gifts.jpg', url: '/products/sample-gift-hamper-set',
    gfTags: ['gf-for-couple', 'gf-for-family', 'gf-500-999', 'gf-oc-diwali', 'gf-oc-wedding', 'gf-oc-anniversary'],
    giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-013', handle: 'sample-kids-wooden-toy',
    title: 'Kids Wooden Toy Set — SAMPLE',
    brand: 'Generic (Sample)', department: 'Toys & Kids', subcategory: 'Toys', type: 'Toys',
    tags: ['audience_boys', 'audience_girls', 'type_toy', 'department_toys_kids'],
    priceInr: 549, compareAtInr: null, available: false, // demonstrates sold-out state
    sizes: ['3+ Years'], colors: [],
    image: '/images/dept-kids.jpg', url: '/products/sample-kids-wooden-toy',
    gfTags: ['gf-for-kids', 'gf-500-999', 'gf-oc-birthday'], giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-014', handle: 'sample-imitation-earring-set',
    title: 'Imitation Jewellery Earring Set — SAMPLE',
    brand: 'Generic (Sample)', department: 'Imitation Jewellery', subcategory: 'Earrings', type: 'Earrings',
    tags: ['type_earrings', 'department_imitation_jewellery'],
    priceInr: 349, compareAtInr: null, available: true,
    sizes: [], colors: ['Gold Tone'],
    image: '/images/dept-jewellery.jpg', url: '/products/sample-imitation-earring-set',
    gfTags: ['gf-for-her', 'gf-199-499', 'gf-oc-wedding', 'gf-oc-anniversary', 'gf-oc-rakhi'],
    giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-015', handle: 'sample-mens-leather-belt',
    title: "Men's Leather Belt — SAMPLE",
    brand: 'Generic (Sample)', department: 'Accessories & Grooming', subcategory: 'Belts', type: 'Belt',
    tags: ['audience_men', 'type_belt', 'department_accessories_grooming'],
    priceInr: 499, compareAtInr: null, available: true,
    sizes: ['32', '34', '36', '38'], colors: ['Tan', 'Black'],
    image: '/images/dept-accessories.jpg', url: '/products/sample-mens-leather-belt',
    gfTags: ['gf-for-him', 'gf-199-499', 'gf-oc-birthday'], giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-016', handle: 'sample-rakhi-gift-combo',
    title: 'Rakhi Gift Combo — SAMPLE',
    brand: 'Generic (Sample)', department: 'Gift Articles', subcategory: 'Rakhi', type: 'Rakhi Set',
    tags: ['type_rakhi_set', 'department_gift_articles'],
    priceInr: 299, compareAtInr: null, available: true,
    sizes: [], colors: [],
    image: '/images/dept-gifts.jpg', url: '/products/sample-rakhi-gift-combo',
    gfTags: ['gf-for-him', 'gf-199-499', 'gf-oc-rakhi'], giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-017', handle: 'sample-festive-diwali-hamper',
    title: 'Festive Diwali Hamper — SAMPLE',
    brand: 'Generic (Sample)', department: 'Gift Articles', subcategory: 'Festive', type: 'Festive Hamper',
    tags: ['type_festive_hamper', 'department_gift_articles'],
    priceInr: 1499, compareAtInr: null, available: true,
    sizes: [], colors: [],
    image: '/images/gift-finder.jpg', url: '/products/sample-festive-diwali-hamper',
    gfTags: ['gf-for-family', 'gf-for-her', 'gf-for-him', 'gf-1000-plus', 'gf-oc-diwali'],
    giftWrapEligible: true, isSample: true,
  },
  {
    id: 'mc-018', handle: 'sample-unisex-perfume',
    title: 'Unisex Perfume 50 ml — SAMPLE',
    brand: 'Generic (Sample)', department: 'Accessories & Grooming', subcategory: 'Perfumes', type: 'Perfume',
    tags: ['audience_unisex', 'type_perfume', 'department_accessories_grooming'],
    priceInr: 999, compareAtInr: null, available: true,
    sizes: ['50 ml'], colors: [],
    image: '/images/dept-accessories.jpg', url: '/products/sample-unisex-perfume',
    gfTags: ['gf-for-him', 'gf-for-her', 'gf-500-999', 'gf-oc-diwali', 'gf-oc-anniversary'],
    giftWrapEligible: true, isSample: true,
  },
];

export const GIFT_FINDER_OPTIONS = {
  occasions: [
    { value: 'gf-oc-diwali', label: 'Diwali' },
    { value: 'gf-oc-rakhi', label: 'Raksha Bandhan' },
    { value: 'gf-oc-birthday', label: 'Birthday' },
    { value: 'gf-oc-anniversary', label: 'Anniversary' },
    { value: 'gf-oc-wedding', label: 'Wedding' },
  ],
  recipients: [
    { value: 'gf-for-her', label: 'For Her' },
    { value: 'gf-for-him', label: 'For Him' },
    { value: 'gf-for-kids', label: 'For Kids' },
    { value: 'gf-for-couple', label: 'For a Couple' },
    { value: 'gf-for-family', label: 'For Family' },
  ],
  budgets: [
    { value: 'gf-under-199', label: 'Under ₹199', min: 0, max: 199 },
    { value: 'gf-199-499', label: '₹199 – ₹499', min: 199, max: 499 },
    { value: 'gf-500-999', label: '₹500 – ₹999', min: 500, max: 999 },
    { value: 'gf-1000-plus', label: '₹1000 & above', min: 1000, max: Infinity },
  ],
} as const;

export function findGifts(occasion: string, recipient: string, budget: string): DemoProduct[] {
  return DEMO_PRODUCTS.filter(
    (p) => p.available && p.gfTags.includes(occasion) && p.gfTags.includes(recipient) && p.gfTags.includes(budget),
  );
}

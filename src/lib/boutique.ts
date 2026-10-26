// ─────────────────────────────────────────────────────────────────────────────
// BOUTIQUE PREVIEW DATA — faithful copy of the approved design reference.
//
// ⚠️ HONESTY RULES (unchanged from SPEC §0):
// - Every product here is an explicitly SAMPLE item ("Sample brand" vendor)
//   used only to demonstrate the theme design. None of these titles, prices,
//   discounts or stock states are real store data.
// - The real catalogue lives exclusively in Shopify after the owner imports
//   actual products (see /api/products-csv + guides).
// - Brand rules are enforced: Zoiro men's-only, Bodycare kids/women-only,
//   Lady Care women-only, Lotus Herbals never makeup, L'Oréal Paris kept
//   separate from L'Oréal Professionnel. NO kitchenware/cutlery department.
// ─────────────────────────────────────────────────────────────────────────────

export type BoutiqueProduct = {
  id: string;
  title: string;
  vendor: string;
  price: number;
  compareAt?: number;
  image: string;
  image2?: string;
  available: boolean;
  variants?: string[];
  tags: string[];
  audience?: string;
};

/** Image helper — reference served /preview/<name>.jpg; we serve /images/. */
export const img = (name: string) => `/images/${name}.jpg`;

export const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ── Store details (owner-verified, see store-info.ts) ───────────────────────

export const STORE = {
  name: 'MAHADEV CUTLERY & GIFT ARTICLES',
  address:
    'A-15, Shivalik Bungalows, Vastral Road, Opposite Ratanpura Gam, Vastral, Ahmedabad, Gujarat 382418, India',
  maps: 'https://maps.app.goo.gl/P3AkDsq9bySkxAVbA',
  phones: ['9898648776', '9998268636'],
  email: 'mahadevcutlery@gmail.com', // owner typed "...comi" — treated as typo, confirm with owner
  instagram: 'https://www.instagram.com/mahadev_cutlery/',
  whatsappNumber: '919898648776',
} as const;

// ── Announcement bar ─────────────────────────────────────────────────────────

export const ANNOUNCEMENTS = [
  'Beauty, innerwear, gifts & more — curated in Ahmedabad',
  'Explore original products from brands you trust',
];

// ── Header nav + mega menu ───────────────────────────────────────────────────

export const NAV_LINKS = [
  'Shop All',
  'Beauty & Makeup',
  'Skincare',
  'Haircare',
  'Hosiery & Innerwear',
  'Toys & Kids',
  'Gift Articles',
  'Imitation Jewellery',
  'Accessories & Grooming',
  'Brands',
];

export const MENU_GROUPS = [
  {
    heading: 'Shop by Department',
    links: [
      'Beauty & Makeup',
      'Skincare',
      'Haircare',
      'Hosiery & Innerwear',
      'Toys & Kids',
      'Gift Articles',
      'Imitation Jewellery',
      'Accessories & Grooming',
    ],
  },
  {
    heading: 'Shop by Brand',
    links: [
      'Cetaphil',
      'Jockey',
      'Lakmé',
      "L'Oréal Paris",
      "L'Oréal Professionnel",
      'Lotus Herbals',
      'Maybelline New York',
      'Minimalist',
      'Swiss Beauty',
      'VEGA',
    ],
  },
  {
    heading: 'Shop by Product Type',
    links: [
      'Face Wash',
      'Moisturizer',
      'Serum',
      'Shampoo',
      'Conditioner',
      'Lip Products',
      'Makeup Products',
      'Innerwear',
      'Toys',
      'Gifts',
    ],
  },
] as const;

// ── Departments ──────────────────────────────────────────────────────────────

export const DEPARTMENTS = [
  { title: 'Beauty & Makeup', sub: 'Lips, eyes, face', img: 'dept-makeup' },
  { title: 'Skincare', sub: 'Cleanse, treat, protect', img: 'dept-beauty' },
  { title: 'Haircare', sub: 'Everyday & professional', img: 'dept-haircare' },
  { title: 'Hosiery & Innerwear', sub: 'Men, women & kids', img: 'dept-innerwear' },
  { title: 'Toys & Kids', sub: 'Play & learn', img: 'dept-kids' },
  { title: 'Gift Articles', sub: 'For every occasion', img: 'dept-gifts' },
  { title: 'Imitation Jewellery', sub: 'Everyday sparkle', img: 'dept-jewellery' },
  { title: 'Accessories & Grooming', sub: 'Tools, grooming & more', img: 'dept-tools' },
] as const;

// ── Brands ───────────────────────────────────────────────────────────────────

/** Brand → note shown on featured cards (brand rules, owner-confirmed). */
export const BRAND_NOTES: Record<string, string> = {
  Zoiro: "Men's nikar / underwear only",
  Bodycare: 'Kids (boys, girls) & women only',
  'Lady Care': "Women's nikar / panty only",
  'Lotus Herbals': 'Skincare, face & haircare — never makeup',
};

const BRAND_GROUPS = [
  {
    group: 'Hosiery & Innerwear',
    brands: ['Jockey', 'Van Heusen', 'Zoiro', 'Sunny', 'Bodycare', 'Lady Care'],
  },
  {
    group: 'Haircare',
    brands: [
      "L'Oréal Professionnel",
      "L'Oréal Paris",
      'Matrix',
      'Wella Professionals',
      'Garnier',
      'Minimalist',
    ],
  },
  {
    group: 'Beauty & Makeup',
    brands: ['Swiss Beauty', 'Lakmé', 'MARS Cosmetics', 'Maybelline New York', 'Colorbar', 'Faces Canada'],
  },
  {
    group: 'Skincare & Beauty',
    brands: [
      'Lotus Herbals',
      'O3+',
      'Cetaphil',
      'Sebamed',
      'Pilgrim',
      'Plix',
      'NIVEA',
      "POND'S",
      'Dot & Key',
      'Ghar Soaps',
    ],
  },
  {
    group: 'Accessories & Grooming',
    brands: ['VEGA', 'Philips'],
  },
] as const;

/** All 30 brands, alphabetically sorted (single source for A–Z directory). */
export const ALL_BRANDS: string[] = Array.from(
  new Set(BRAND_GROUPS.flatMap((g) => [...g.brands])),
).sort((a, b) => a.localeCompare(b));

/** Featured brands carousel (12 cards). */
export const FEATURED_BRANDS = [
  'Jockey',
  'Lakmé',
  "L'Oréal Paris",
  "L'Oréal Professionnel",
  'Maybelline New York',
  'Lotus Herbals',
  'Swiss Beauty',
  'Cetaphil',
  'Minimalist',
  'VEGA',
  'Philips',
  'NIVEA',
];

// ── Product types (circular chips) ───────────────────────────────────────────

export const PRODUCT_TYPES = [
  { title: 'Face Wash', img: 'dept-beauty' },
  { title: 'Face Cream', img: 'editorial-skincare' },
  { title: 'Sunscreen', img: 'dept-beauty' },
  { title: 'Serum', img: 'dept-beauty' },
  { title: 'Shampoo', img: 'dept-haircare' },
  { title: 'Conditioner', img: 'dept-haircare' },
  { title: 'Lip Products', img: 'dept-makeup' },
  { title: 'Makeup', img: 'dept-makeup' },
  { title: 'Innerwear', img: 'dept-innerwear' },
  { title: 'Gifts', img: 'dept-gifts' },
  { title: 'Toys', img: 'dept-kids' },
] as const;

// ── Sample catalogue (8 products, reference-exact) ───────────────────────────

type ProductSeed = Omit<BoutiqueProduct, 'vendor' | 'available'> & {
  available?: boolean;
};

const seed = (p: ProductSeed): BoutiqueProduct => ({
  vendor: 'Sample brand',
  available: true,
  tags: [],
  ...p,
});

export const PRODUCTS: BoutiqueProduct[] = [
  seed({
    id: 'p1',
    title: 'Hydrating gel face wash, 100 ml',
    price: 299,
    image: img('dept-beauty'),
    image2: img('editorial-skincare'),
    tags: ['occasion-birthday', 'recipient-her'],
    audience: 'Unisex',
  }),
  seed({
    id: 'p2',
    title: 'Matte lipstick trio',
    price: 649,
    compareAt: 799,
    image: img('dept-makeup'),
    image2: img('dept-tools'),
    tags: ['occasion-diwali', 'occasion-raksha-bandhan', 'recipient-her', 'gift-idea'],
    audience: 'Women',
  }),
  seed({
    id: 'p3',
    title: 'Nourishing shampoo & conditioner set',
    price: 899,
    image: img('dept-haircare'),
    image2: img('dept-beauty'),
    variants: ['200 ml', '400 ml'],
    tags: ['occasion-diwali', 'recipient-family', 'gift-idea'],
    audience: 'Unisex',
  }),
  seed({
    id: 'p4',
    title: 'Gold-tone bangle set',
    price: 549,
    image: img('dept-jewellery'),
    image2: img('dept-gifts'),
    tags: ['occasion-raksha-bandhan', 'occasion-wedding', 'recipient-her', 'festive'],
    audience: 'Women',
  }),
  seed({
    id: 'p5',
    title: "Men's cotton brief, pack of 2",
    price: 399,
    image: img('dept-innerwear'),
    image2: img('dept-innerwear'),
    variants: ['S', 'M', 'L', 'XL'],
    tags: ['recipient-him'],
    audience: 'Men',
  }),
  seed({
    id: 'p6',
    title: 'Wooden stacking toy',
    price: 349,
    available: false,
    image: img('dept-kids'),
    image2: img('dept-gifts'),
    tags: ['occasion-birthday', 'recipient-kids'],
    audience: 'Kids – Unisex',
  }),
  seed({
    id: 'p7',
    title: 'Festive gift hamper box',
    price: 1299,
    compareAt: 1499,
    image: img('dept-gifts'),
    image2: img('dept-jewellery'),
    tags: ['occasion-diwali', 'occasion-wedding', 'recipient-family', 'gift-idea', 'festive'],
  }),
  seed({
    id: 'p8',
    title: 'Detangling paddle brush',
    price: 249,
    image: img('dept-tools'),
    image2: img('dept-haircare'),
    tags: ['recipient-anyone'],
  }),
];

export const NEW_ARRIVALS = [...PRODUCTS].reverse().slice(0, 4);
export const OFFER_PRODUCTS = PRODUCTS.filter(
  (p) => p.compareAt && p.compareAt > p.price,
);

// ── Gift wrap (mirrors snippets/gift-wrap-options.liquid + theme.js) ────────
// FREE mode stores line-item properties ("Gift wrap" = "Yes", "Gift message").
// CHARGED mode requires a REAL "Gift Wrapping" product in Shopify — its actual
// price is then added to the cart/order by theme.js (syncGiftWrap). The preview
// never invents a fee: with charged=false nothing is added to the subtotal.

export const GIFT_WRAP = {
  enabled: true,
  charged: false, // owner sets true + real product in Theme settings → Gift wrapping
  /** Real fee in ₹, only used when charged=true and the owner configures one. */
  fee: null as number | null,
  maxMessage: 200,
} as const;

// ── Festival countdown (mirrors sections/festival-countdown.liquid) ─────────
// Dates are Asia/Kolkata (IST, UTC+05:30 — no DST). The owner re-verifies dates
// yearly (documented). Banner hides automatically after date + hideAfterDays.

export type Festival = {
  key: string;
  name: string;
  /** ISO date (yyyy-mm-dd) of the festival's start day at 00:00 IST. */
  date: string;
  hideAfterDays: number;
  enabled: boolean;
  link: string;
};

export const FESTIVALS: Festival[] = [
  {
    key: 'diwali',
    name: 'Diwali',
    date: '2026-11-08', // Lakshmi Puja, Asia/Kolkata — owner re-verifies yearly
    hideAfterDays: 3,
    enabled: true,
    link: '#gift-finder',
  },
  {
    key: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    date: '2026-08-28', // already passed → banner auto-hides (honest demo of the rule)
    hideAfterDays: 3,
    enabled: false,
    link: '#gift-finder',
  },
];

/** Epoch ms of yyyy-mm-ddT00:00:00 IST. */
export function festivalTargetMs(date: string): number {
  return Date.parse(`${date}T00:00:00+05:30`);
}

export type FestivalState = {
  festival: Festival;
  state: 'upcoming' | 'live' | 'ended';
  /** ms remaining until the festival start (upcoming) or since start (live). */
  remainingMs: number;
};

/**
 * Picks the banner-worthy festival: the next upcoming enabled one, or one that
 * started but is still inside its show-window. Returns null when the banner
 * must be hidden entirely (e.g. Raksha Bandhan 2026-08-28, passed + disabled).
 */
export function pickActiveFestival(nowMs = Date.now()): FestivalState | null {
  for (const festival of FESTIVALS) {
    if (!festival.enabled) continue;
    const target = festivalTargetMs(festival.date);
    const limit = target + festival.hideAfterDays * 86_400_000;
    if (nowMs < target) {
      return { festival, state: 'upcoming', remainingMs: target - nowMs };
    }
    if (nowMs < limit) {
      return { festival, state: 'live', remainingMs: nowMs - target };
    }
    // ended + window over → keep looking (banner hidden for this festival)
  }
  return null;
}

/** Splits a remaining-ms into countdown units (IST-independent, pure math). */
export function countdownParts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  };
}

// ── WhatsApp ordering ────────────────────────────────────────────────────────

export const WA_GREETING = 'Hello Mahadev Cutlery & Gift Articles, I would like to order:';
export const WA_CLOSING = 'Please confirm availability and the final price.';
export const WA_NOTE =
  'WhatsApp orders are confirmed only after we reply with availability and the final price. Nothing is charged until you confirm with the store.';

/** Builds the prefilled WhatsApp order message (reference-exact format). */
export function buildWhatsAppMessage(
  product: BoutiqueProduct,
  variant: string | null,
  qty: number,
  link: string,
  gift?: { message?: string },
) {
  const lines = [WA_GREETING, '', `Product: ${product.title}`];
  if (variant) lines.push(`Option: ${variant}`);
  lines.push(`Quantity: ${qty}`);
  if (gift) {
    lines.push('Gift wrap: Yes');
    if (gift.message) lines.push(`Gift message: ${gift.message}`);
  }
  lines.push(`Link: ${link}`, '', WA_CLOSING);
  return lines.join('\n');
}

// ── Gift finder (reference-exact options + fallback logic) ──────────────────

export type GiftChoice = { label: string; hint?: string; value: string; aud?: string };

export const GIFT_OCCASIONS: GiftChoice[] = [
  { label: 'Diwali', hint: 'Lights & sweets', value: 'occasion-diwali' },
  { label: 'Raksha Bandhan', hint: 'For siblings', value: 'occasion-raksha-bandhan' },
  { label: 'Bhai Dooj', hint: 'For siblings', value: 'occasion-bhai-dooj' },
  { label: 'Birthday', hint: 'Any age', value: 'occasion-birthday' },
  {
    label: 'Wedding & anniversary',
    hint: 'Shagun & return gifts',
    value: 'occasion-wedding,occasion-anniversary',
  },
  { label: 'Just because', hint: 'Any occasion', value: '' },
];

export const GIFT_RECIPIENTS: GiftChoice[] = [
  { label: 'For her', hint: 'Mother, sister, friend', value: 'recipient-her', aud: 'Women' },
  { label: 'For him', hint: 'Father, brother, friend', value: 'recipient-him', aud: 'Men' },
  {
    label: 'For kids',
    hint: 'Little ones',
    value: 'recipient-kids',
    aud: 'Kids – Boys,Kids – Girls,Kids – Unisex',
  },
  { label: 'For the family', hint: 'Home & hampers', value: 'recipient-family', aud: '' },
  { label: 'Anyone', hint: 'Surprise me', value: '', aud: '' },
];

export const GIFT_BUDGETS: GiftChoice[] = [
  { label: 'Under ₹300', value: '0-299' },
  { label: '₹300 – ₹699', value: '300-699' },
  { label: '₹700 – ₹1,499', value: '700-1499' },
  { label: '₹1,500 & above', value: '1500-0' },
  { label: 'Any budget', value: '0-0' },
];

export const GIFT_STEPS = [
  { key: 'occasion', q: "What's the occasion?", short: 'Occasion', choices: GIFT_OCCASIONS },
  { key: 'recipient', q: 'Who is it for?', short: 'For whom', choices: GIFT_RECIPIENTS },
  { key: 'budget', q: "What's your budget?", short: 'Budget', choices: GIFT_BUDGETS },
] as const;

const tagList = (value: string | undefined) =>
  (value ?? '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

export type GiftResult = {
  items: BoutiqueProduct[];
  /** Structured fallback note — the UI localizes it (see gift-finder.tsx). */
  note:
    | null
    | { kind: 'occasion'; occasion: string | null; recipient: string | null }
    | { kind: 'recipient'; occasion: string | null; recipient: string | null };
};

/**
 * Reference-exact three-tier fallback:
 * 1. in budget + occasion + recipient
 * 2. in budget + recipient (note: occasion not tagged yet)
 * 3. in budget + occasion (note: recipient relaxed)
 */
export function findGiftIdeas(
  products: BoutiqueProduct[],
  occasion: GiftChoice | null,
  recipient: GiftChoice | null,
  budget: GiftChoice | null,
  limit = 8,
): GiftResult {
  const occ = tagList(occasion?.value);
  const rec = tagList(recipient?.value);
  const aud = recipient?.aud ?? '';
  const [min, max] = (budget?.value ?? '0-0').split('-').map(Number);
  const tagsOf = (p: BoutiqueProduct) => (p.tags ?? []).map((t) => t.toLowerCase());
  const inBudget = (p: BoutiqueProduct) =>
    p.available && p.price >= min && (!max || p.price <= max);
  const matchesOccasion = (p: BoutiqueProduct) =>
    !occ.length || tagsOf(p).some((t) => t === 'occasion-any' || occ.includes(t));
  const matchesRecipient = (p: BoutiqueProduct) =>
    (!rec.length && !aud.length) ||
    tagsOf(p).some((t) => t === 'recipient-anyone' || rec.includes(t)) ||
    (!!p.audience && aud.split(',').map((a) => a.trim().toLowerCase()).includes(p.audience.toLowerCase()));
  const untaggedPenalty = (p: BoutiqueProduct) =>
    +!tagsOf(p).some((t) => t === 'gift-idea' || t === 'festive');

  const tiers: { items: BoutiqueProduct[]; note: GiftResult['note'] }[] = [
    {
      items: products.filter((p) => inBudget(p) && matchesOccasion(p) && matchesRecipient(p)),
      note: null,
    },
    {
      items: products.filter((p) => inBudget(p) && matchesRecipient(p)),
      note: { kind: 'occasion', occasion: occasion?.label ?? null, recipient: recipient?.label ?? null },
    },
    {
      items: products.filter((p) => inBudget(p) && matchesOccasion(p)),
      note: { kind: 'recipient', occasion: occasion?.label ?? null, recipient: recipient?.label ?? null },
    },
  ];

  const tier = tiers.find((t) => t.items.length);
  if (!tier) return { items: [], note: null };

  return {
    items: [...tier.items]
      .sort((a, b) => untaggedPenalty(a) - untaggedPenalty(b) || a.price - b.price)
      .slice(0, limit),
    note: tier.note,
  };
}

// ── Shop-by-budget cards ─────────────────────────────────────────────────────

export const BUDGET_CARDS: [string, string][] = [
  ['Under', '₹199'],
  ['Under', '₹499'],
  ['Treat yourself', 'Premium Picks'],
];

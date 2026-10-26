// ─────────────────────────────────────────────────────────────────────────────
// Verified store constants — MAHADEV CUTLERY & GIFT ARTICLES
// Source: owner-verified details recorded in shopify-theme/SPEC.md §1.
// Nothing here is invented; only fields confirmed by the owner are included.
// ─────────────────────────────────────────────────────────────────────────────

export const STORE_INFO = {
  name: 'MAHADEV CUTLERY & GIFT ARTICLES',
  logoLine1: 'MAHADEV',
  logoLine2: 'CUTLERY & GIFT ARTICLES',
  addressLines: [
    'A-15, Shivalik Bungalows',
    'Vastral Road, Opposite Ratanpura Gam',
    'Vastral, Ahmedabad, Gujarat 382418',
    'India',
  ],
  phones: ['+91 98986 48776', '+91 99982 68636'],
  email: 'mahadevcutlery@gmail.com', // owner typed "...comi" — treated as typo (see SPEC §1)
  instagram: 'https://www.instagram.com/mahadev_cutlery/',
  mapsUrl: 'https://maps.app.goo.gl/P3AkDsq9bySkxAVbA',
  whatsappNumber: '919898648776',
} as const;

// WhatsApp deep link for a prefilled chat with the store.
export function whatsappLink(message: string): string {
  return `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Festival countdown configuration (Asia/Kolkata).
//
// Dates must be verified by the owner EVERY YEAR (see SPEC §5):
// - Diwali: 2026-11-08 (upcoming — the default active festival for this build).
// - Raksha Bandhan 2026 fell on 2026-08-28, which has already passed as of the
//   build date (2026-10-25). The next configured occurrence is 2027-08-17 and
//   is shipped inactive until the owner confirms the date.
// A past date makes the countdown banner auto-hide (same behavior as the theme).
// ─────────────────────────────────────────────────────────────────────────────

export type Festival = {
  key: string;
  name: string;
  /** ISO date-time with the IST offset (+05:30). */
  date: string;
  active: boolean;
};

export const FESTIVALS: Festival[] = [
  { key: 'diwali', name: 'Diwali', date: '2026-11-08T00:00:00+05:30', active: true },
  { key: 'raksha-bandhan', name: 'Raksha Bandhan', date: '2027-08-17T00:00:00+05:30', active: false },
];

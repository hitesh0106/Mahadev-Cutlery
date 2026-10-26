// ─────────────────────────────────────────────────────────────────────────────
// Showcase interface strings — EN / HI / GU.
// Mirrors the theme's locale files (en.default.json / hi.json / gu.json):
// interface labels only — brand names, product titles and prices are NEVER
// translated.
//
// Honest scope note (see the Languages guide): a fully translated STORE
// requires Shopify Settings → Languages + the free "Translate & Adapt" app.
// This selector only switches the language of this demo interface.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';

export type Lang = 'en' | 'hi' | 'gu';

export const LANGUAGE_OPTIONS: { value: Lang; native: string; english: string }[] = [
  { value: 'en', native: 'English', english: 'English' },
  { value: 'hi', native: 'हिंदी', english: 'Hindi' },
  { value: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
];

export const I18N_SCOPE_NOTE =
  'This selector changes the demo interface only. Full-store Hindi/Gujarati requires Shopify Settings → Languages + the free Translate & Adapt app (see the Languages guide).';

export const UI_STRINGS = {
  en: {
    'nav.storefront': 'Storefront Preview',
    'nav.finder': 'Gift Finder',
    'nav.demo': 'Product Demo',
    'nav.delivery': 'Delivery & Downloads',
    'nav.report': 'Verification Report',
    'action.addToCart': 'Add to cart',
    'action.wishlist': 'Wishlist',
    'action.whatsapp': 'Order on WhatsApp',
    'action.findGift': 'Find a Gift',
    'action.browse': 'Browse Departments',
    'action.view': 'View',
    'action.back': 'Back',
    'action.next': 'Next',
    'action.reset': 'Reset',
    'label.sample': 'SAMPLE',
    'label.soldOut': 'Sold out',
    'label.inStock': 'In stock',
    'label.samplePrice': 'Sample price',
    'section.departments': 'Shop by Department',
    'section.featured': 'Featured Products',
    'section.recentlyViewed': 'Recently Viewed',
    'section.related': 'Related Products',
    'section.sameBrand': 'More from this Brand',
    'section.brandRules': 'Brand Rules We Follow',
    'finder.resultsCount': '{count} matching sample products',
    'footer.shop': 'Shop',
    'footer.storeInfo': 'Store Info',
    'footer.about': 'About',
    'wishlist.deviceNote':
      'Saved on this device only — not synced across devices',
  },
  hi: {
    'nav.storefront': 'स्टोरफ्रंट प्रीव्यू',
    'nav.finder': 'उपहार खोज',
    'nav.demo': 'प्रोडक्ट डेमो',
    'nav.delivery': 'डिलीवरी और डाउनलोड',
    'nav.report': 'सत्यापन रिपोर्ट',
    'action.addToCart': 'कार्ट में जोड़ें',
    'action.wishlist': 'इच्छा सूची',
    'action.whatsapp': 'WhatsApp पर ऑर्डर करें',
    'action.findGift': 'उपहार खोजें',
    'action.browse': 'विभाग देखें',
    'action.view': 'देखें',
    'action.back': 'वापस',
    'action.next': 'आगे',
    'action.reset': 'रीसेट',
    'label.sample': 'नमूना',
    'label.soldOut': 'स्टॉक समाप्त',
    'label.inStock': 'स्टॉक में उपलब्ध',
    'label.samplePrice': 'नमूना मूल्य',
    'section.departments': 'विभाग अनुसार खरीदारी',
    'section.featured': 'चुनिंदा उत्पाद',
    'section.recentlyViewed': 'हाल में देखे गए',
    'section.related': 'संबंधित उत्पाद',
    'section.sameBrand': 'इसी ब्रांड से और भी',
    'section.brandRules': 'हमारे ब्रांड नियम',
    'finder.resultsCount': '{count} मिलते-जुलते नमूना उत्पाद',
    'footer.shop': 'खरीदारी',
    'footer.storeInfo': 'स्टोर जानकारी',
    'footer.about': 'परिचय',
    'wishlist.deviceNote':
      'केवल इसी डिवाइस पर सहेजा गया — अन्य डिवाइस पर सिंक नहीं होता',
  },
  gu: {
    'nav.storefront': 'સ્ટોરફ્રન્ટ પ્રીવ્યૂ',
    'nav.finder': 'ભેટ ફાઇન્ડર',
    'nav.demo': 'પ્રોડક્ટ ડેમો',
    'nav.delivery': 'ડિલિવરી અને ડાઉનલોડ',
    'nav.report': 'ચકાસણી અહેવાલ',
    'action.addToCart': 'કાર્ટમાં ઉમેરો',
    'action.wishlist': 'ઇચ્છા યાદી',
    'action.whatsapp': 'WhatsApp પર ઓર્ડર કરો',
    'action.findGift': 'ભેટ શોધો',
    'action.browse': 'વિભાગો જુઓ',
    'action.view': 'જુઓ',
    'action.back': 'પાછળ',
    'action.next': 'આગળ',
    'action.reset': 'રીસેટ',
    'label.sample': 'નમૂનો',
    'label.soldOut': 'સ્ટોક સમાપ્ત',
    'label.inStock': 'સ્ટોકમાં છે',
    'label.samplePrice': 'નમૂના ભાવ',
    'section.departments': 'વિભાગ પ્રમાણે ખરીદી',
    'section.featured': 'પસંદ કરેલા પ્રોડક્ટ',
    'section.recentlyViewed': 'તાજેતરમાં જોયેલા',
    'section.related': 'સંબંધિત પ્રોડક્ટ',
    'section.sameBrand': 'આ જ બ્રાન્ડની વધુ',
    'section.brandRules': 'અમારા બ્રાન્ડ નિયમો',
    'finder.resultsCount': '{count} મેળ ખાતા નમૂના પ્રોડક્ટ',
    'footer.shop': 'ખરીદી',
    'footer.storeInfo': 'સ્ટોર માહિતી',
    'footer.about': 'પરિચય',
    'wishlist.deviceNote':
      'ફક્ત આ ડિવાઇસ પર સચવાયેલ — અન્ય ડિવાઇસ સાથે સિંક થતું નથી',
  },
} as const;

export type UIStringKey = keyof (typeof UI_STRINGS)['en'];

/** Small zustand store so every component shares the selected demo language. */
type LangState = { lang: Lang; setLang: (lang: Lang) => void };

export const useLangStore = create<LangState>((set) => ({
  lang: 'en',
  setLang: (lang) => set({ lang }),
}));

/** Translation lookup with English fallback. `{count}` is interpolated. */
export function translate(
  lang: Lang,
  key: UIStringKey,
  vars?: Record<string, string | number>,
): string {
  const bundle = UI_STRINGS[lang] as Record<string, string>;
  const fallback = UI_STRINGS.en as Record<string, string>;
  let text = bundle[key] ?? fallback[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, String(value));
    }
  }
  return text;
}

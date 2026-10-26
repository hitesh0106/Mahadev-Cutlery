'use client';

// Preview i18n — EN / हिन्दी / ગુજરાતી interface language for the showcase app.
// Mirrors the Shopify theme's bundled locale files (en.default.json / hi.json /
// gu.json): interface strings only. Brand names, product titles, prices and the
// WhatsApp order message (store-facing) are never translated.
//
// Implementation: external store + useSyncExternalStore (same SSR-safe pattern
// as the wishlist), persisted to localStorage 'mahadev-preview:lang'.

import { useSyncExternalStore } from 'react';

export type Lang = 'en' | 'hi' | 'gu';

export const LANGUAGES: { code: Lang; label: string; short: string; native: boolean }[] = [
  { code: 'en', label: 'English', short: 'EN', native: true },
  { code: 'hi', label: 'हिन्दी', short: 'हिं', native: true },
  { code: 'gu', label: 'ગુજરાતી', short: 'ગુ', native: true },
];

const LANG_KEY = 'mahadev-preview:lang';
const LANG_EVENT = 'mahadev-preview:lang-changed';

type Listener = () => void;
const listeners = new Set<Listener>();
let langCache: Lang | null = null;

function readLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === 'hi' || stored === 'gu' ? stored : 'en';
  } catch {
    return 'en';
  }
}

function getLangSnapshot(): Lang {
  if (langCache === null) langCache = readLang();
  return langCache;
}

function getServerLang(): Lang {
  return 'en';
}

function subscribeLang(listener: Listener) {
  listeners.add(listener);
  const onChanged = () => listener();
  window.addEventListener(LANG_EVENT, onChanged);
  window.addEventListener('storage', onChanged);
  return () => {
    listeners.delete(listener);
    window.removeEventListener(LANG_EVENT, onChanged);
    window.removeEventListener('storage', onChanged);
  };
}

export function setLang(next: Lang) {
  langCache = next;
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {
    // Storage unavailable — language stays for this session only.
  }
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new Event(LANG_EVENT));
  document.documentElement.lang = next === 'en' ? 'en' : next;
}

/** Keep <html lang> in sync (called by the language switcher). */
export function syncDocumentLang() {
  document.documentElement.lang = getLangSnapshot() === 'en' ? 'en' : getLangSnapshot();
}

// ── Dictionaries ─────────────────────────────────────────────────────────────
// Key = the exact English source string. Missing keys fall back to English.

const HI: Record<string, string> = {
  // Preview banner
  'Visual preview with sample data. The Shopify theme shows your real products, prices and brands.':
    'नमूना डेटा के साथ विज़ुअल प्रीव्यू। Shopify थीम आपके असली प्रोडक्ट, क़ीमत और ब्रांड दिखाती है।',
  'Download theme & guides': 'थीम और गाइड डाउनलोड करें',

  // Announcement bar
  'Beauty, innerwear, gifts & more — curated in Ahmedabad':
    'ब्यूटी, इनरवियर, गिफ्ट और बहुत कुछ — अहमदाबाद में चुना हुआ',
  'Explore original products from brands you trust':
    'अपने भरोसेमंद ब्रांड्स के असली प्रोडक्ट देखें',
  'Previous announcement': 'पिछला ऐलान',
  'Next announcement': 'अगला ऐलान',

  // Header / nav
  'Shop All': 'सब खरीदें',
  'Beauty & Skincare': 'ब्यूटी व स्किनकेयर',
  Haircare: 'हेयरकेयर',
  Makeup: 'मेकअप',
  'Hosiery & Innerwear': 'होज़ियरी व इनरवियर',
  'Kids & Toys': 'बच्चों व खिलौने',
  'Gifts & Jewellery': 'गिफ्ट व ज्वेलरी',
  'Beauty Tools': 'ब्यूटी टूल्स',
  Brands: 'ब्रांड्स',
  Offers: 'ऑफ़र',
  'Shop by Department': 'विभाग से खरीदें',
  'Shop by Brand': 'ब्रांड से खरीदें',
  'Shop by Product Type': 'प्रोडक्ट टाइप से खरीदें',
  'Gift Articles': 'गिफ्ट आर्टिकल्स',
  'Imitation Jewellery': 'इमिटेशन ज्वेलरी',
  'Beauty Tools & Grooming': 'ब्यूटी टूल्स व ग्रूमिंग',
  'Accessories & More': 'एक्सेसरीज़ व अन्य',
  'Face Wash': 'फेस वॉश',
  Moisturizer: 'मॉइस्चराइज़र',
  Serum: 'सीरम',
  Shampoo: 'शैम्पू',
  Conditioner: 'कंडीशनर',
  'Lip Products': 'लिप प्रोडक्ट्स',
  'Makeup Products': 'मेकअप प्रोडक्ट्स',
  Innerwear: 'इनरवियर',
  Toys: 'खिलौने',
  Gifts: 'गिफ्ट',
  'Show Shop All menu': 'सब खरीदें मेनू दिखाएँ',
  Search: 'खोजें',
  Wishlist: 'विशलिस्ट',
  'Bag, {count} items': 'बैग, {count} वस्तुएँ',
  'Open menu': 'मेनू खोलें',
  'Close menu': 'मेनू बंद करें',
  Menu: 'मेनू',
  'Search the store': 'स्टोर में खोजें',
  'Search products, brands, categories…': 'प्रोडक्ट, ब्रांड, श्रेणियाँ खोजें…',
  Clear: 'साफ़ करें',
  'Close search': 'खोज बंद करें',
  Products: 'प्रोडक्ट्स',
  'No brand match': 'कोई ब्रांड नहीं मिला',
  'No products found for “{query}”. Try a brand name like “Lakmé” or a type like “shampoo”.':
    '“{query}” के लिए कोई प्रोडक्ट नहीं मिला। “Lakmé” जैसा ब्रांड या “शैम्पू” जैसा टाइप आज़माएँ।',
  'Popular searches': 'लोकप्रिय खोजें',
  'Face wash': 'फेस वॉश',
  Lipstick: 'लिपस्टिक',
  Brief: 'ब्रीफ',
  Gift: 'गिफ्ट',
  Bangle: 'चूड़ी',
  Main: 'मुख्य',
  'Featured brands, scroll horizontally': 'चुनिंदा ब्रांड्स, आड़े स्क्रॉल करें',
  'The Edit': 'एडिट',
  'Everyday skincare essentials': 'रोज़मर्रा के स्किनकेयर ज़रूरी सामान',

  // Hero
  'Mahadev — Ahmedabad': 'महादेव — अहमदाबाद',
  'Beauty, care & gifting,': 'ब्यूटी, देखभाल और गिफ्टिंग,',
  'beautifully curated.': 'ख़ूबसूरती से चुना हुआ।',
  'Skincare, makeup, haircare, innerwear, toys and thoughtful gifts from the brands you know, all in one considered store.':
    'आपके जाने-माने ब्रांड्स के स्किनकेयर, मेकअप, हेयरकेयर, इनरवियर, खिलौने और सोच-समझकर चुने गिफ्ट — सब एक ही स्टोर में।',
  'Shop Now': 'अभी खरीदें',
  'Explore Brands': 'ब्रांड्स देखें',
  'Imitation jewellery': 'इमिटेशन ज्वेलरी',
  'Curated beauty, gifts and jewellery arranged on cream linen':
    'क्रीम लिनन पर सजी ब्यूटी, गिफ्ट और ज्वेलरी',

  // Departments
  Departments: 'विभाग',
  'Shop by department': 'विभाग से खरीदें',
  'Shop all': 'सब देखें',
  'Find it fast': 'जल्दी खोजें',
  'Face Cream': 'फेस क्रीम',
  'Makeup & Cosmetics': 'मेकअप व कॉस्मेटिक्स',
  'Lips, eyes, face': 'होंठ, आँखें, चेहरा',
  Skincare: 'स्किनकेयर',
  'Cleanse, treat, protect': 'सफ़ाई, देखभाल, सुरक्षा',
  'Everyday & professional': 'रोज़मर्रा व प्रोफेशनल',
  'Men, women & kids': 'पुरुष, महिला व बच्चे',
  'Play & learn': 'खेलें व सीखें',
  'For every occasion': 'हर अवसर के लिए',
  'Everyday sparkle': 'रोज़ की चमक',
  'Brushes, combs, trimmers': 'ब्रश, कंघी, ट्रिमर',

  // Featured brands
  'Brands we stock': 'हमारे ब्रांड्स',
  'Featured brands': 'चुनिंदा ब्रांड्स',
  'All brands A–Z': 'सभी ब्रांड्स A–Z',
  Shop: 'खरीदें',
  "Men's nikar / underwear only": 'केवल पुरुषों की निक्कर/अंडरवियर',
  'Kids (boys, girls) & women only': 'केवल बच्चों (लड़के, लड़कियाँ) व महिलाओं के लिए',
  "Women's nikar / panty only": 'केवल महिलाओं की निक्कर/पैंटी',
  'Skincare, face & haircare — never makeup': 'स्किनकेयर, फेस व हेयरकेयर — कभी मेकअप नहीं',

  // Product rows
  'Trending now': 'अभी ट्रेंडिंग',
  'Trending products': 'ट्रेंडिंग प्रोडक्ट्स',
  'Just in': 'अभी-अभी आया',
  'New arrivals': 'नए प्रोडक्ट्स',
  'View all': 'सभी देखें',
  'Genuine savings': 'सच्ची बचत',

  // Product card
  'Sold out': 'बिक चुका',
  '{n}% off': '{n}% छूट',
  'Quick add': 'झटपट जोड़ें',
  Add: 'जोड़ें',
  'Save {title} to wishlist': '{title} विशलिस्ट में सहेजें',
  'Decrease quantity': 'मात्रा घटाएँ',
  'Increase quantity': 'मात्रा बढ़ाएँ',

  // Product page preview
  'Product page preview': 'प्रोडक्ट पेज प्रीव्यू',
  'Inclusive of all taxes. Shipping calculated at checkout.':
    'सभी कर शामिल। शिपिंग की गणना चेकआउट पर।',
  'Size:': 'साइज़:',
  'In stock': 'स्टॉक में',
  'Add to bag': 'बैग में डालें',
  'Order on WhatsApp': 'WhatsApp पर ऑर्डर करें',
  '(opens WhatsApp in a new window)': '(नई विंडो में WhatsApp खुलता है)',
  'WhatsApp orders are confirmed only after we reply with availability and the final price. Nothing is charged until you confirm with the store.':
    'WhatsApp ऑर्डर तभी पक्का होता है जब हम उपलब्धता और अंतिम क़ीमत बता दें। स्टोर से पुष्टि होने तक कुछ भी चार्ज नहीं होता।',
  'Message the shopper sends': 'ग्राहक जो संदेश भेजता है',
  "Preview: the store's number is set in Theme settings → WhatsApp ordering. This preview opens a chat with {number}.":
    'प्रीव्यू: स्टोर का नंबर थीम सेटिंग्स → WhatsApp ऑर्डरिंग में सेट होता है। यह प्रीव्यू {number} से चैट खोलता है।',

  // Gift wrap
  'Add gift wrapping': 'गिफ्ट रैपिंग जोड़ें',
  'Gift wrapping is offered free by the store.': 'गिफ्ट रैपिंग स्टोर की ओर से मुफ़्त है।',
  'Gift wrapping is added as the product “{title}” at {price}.':
    'गिफ्ट रैपिंग “{title}” प्रोडक्ट के रूप में {price} पर जुड़ती है।',
  'Gift message (optional)': 'गिफ्ट संदेश (वैकल्पिक)',
  'Max {count} characters': 'अधिकतम {count} अक्षर',
  '{count} characters left': '{count} अक्षर बाकी',
  'Gift wrap': 'गिफ्ट रैपिंग',
  'Gift message': 'गिफ्ट संदेश',
  Yes: 'हाँ',
  'Wrapping fee': 'रैपिंग शुल्क',

  // Cart
  'Your bag': 'आपका बैग',
  'Shopping bag': 'शॉपिंग बैग',
  'Close bag': 'बैग बंद करें',
  'Your bag is empty': 'आपका बैग खाली है',
  'Discover skincare, makeup, innerwear and thoughtful gifts.':
    'स्किनकेयर, मेकअप, इनरवियर और सोच-समझकर चुने गिफ्ट देखें।',
  Remove: 'हटाएँ',
  Subtotal: 'उप-योग',
  'Taxes and shipping are calculated at checkout.': 'कर और शिपिंग चेकआउट पर गणना होती है।',
  Checkout: 'चेकआउट',
  'Preview only. On Shopify this button opens native checkout.':
    'केवल प्रीव्यू। Shopify पर यह बटन नेटिव चेकआउट खोलता है।',
  "In the real theme this opens Shopify's native checkout":
    'असली थीम में यह Shopify का नेटिव चेकआउट खोलता है',

  // Gift finder
  'Festive gift finder': 'त्योहारी गिफ्ट फ़ाइंडर',
  'Find the perfect gift in three taps': 'तीन टैप में एकदम सही गिफ्ट खोजें',
  "Tell us the occasion, who it's for and your budget. We'll suggest in-stock gifts from our shelves.":
    'अवसर, गिफ्ट किसके लिए है और आपका बजट बताएँ। हम स्टॉक में से उपलब्ध गिफ्ट सुझाएँगे।',
  Occasion: 'अवसर',
  'For whom': 'किसके लिए',
  Budget: 'बजट',
  "What's the occasion?": 'अवसर क्या है?',
  'Who is it for?': 'यह किसके लिए है?',
  "What's your budget?": 'आपका बजट क्या है?',
  Diwali: 'दिवाली',
  'Lights & sweets': 'रोशनी व मिठाई',
  'Raksha Bandhan': 'रक्षा बंधन',
  'For siblings': 'भाई-बहन के लिए',
  'Bhai Dooj': 'भाई दूज',
  Birthday: 'जन्मदिन',
  'Any age': 'हर उम्र',
  'Wedding & anniversary': 'शादी व सालगिरह',
  'Shagun & return gifts': 'शगुन व रिटर्न गिफ्ट',
  'Just because': 'बस ऐसे ही',
  'Any occasion': 'कोई भी अवसर',
  'For her': 'महिला के लिए',
  'Mother, sister, friend': 'माँ, बहन, दोस्त',
  'For him': 'पुरुष के लिए',
  'Father, brother, friend': 'पिता, भाई, दोस्त',
  'For kids': 'बच्चों के लिए',
  'Little ones': 'छोटे बच्चों के लिए',
  'For the family': 'परिवार के लिए',
  'Home & hampers': 'घर व हैम्पर',
  Anyone: 'कोई भी',
  'Surprise me': 'सरप्राइज़ दें',
  'Under ₹300': '₹300 तक',
  '₹1,500 & above': '₹1,500 और ऊपर',
  'Any budget': 'कोई भी बजट',
  'Your gift ideas': 'आपके गिफ्ट आइडिया',
  '1 idea': '1 विकल्प',
  '{count} ideas': '{count} विकल्प',
  'Start again': 'फिर से शुरू करें',
  'No matching gifts right now': 'अभी कोई मेल खाता गिफ्ट नहीं',
  "Nothing in stock matches these choices at the moment. Try another budget or recipient, or ask us. We'll gladly help in store or on WhatsApp.":
    'इस समय इन पसंदों पर स्टॉक में कुछ नहीं है। दूसरा बजट या पाने वाला आज़माएँ, या हमसे पूछें। हम स्टोर या WhatsApp पर मदद करेंगे।',
  'Change my choices': 'पसंद बदलें',
  'Browse all products': 'सभी प्रोडक्ट देखें',
  'Show gift ideas': 'गिफ्ट आइडिया दिखाएँ',
  Next: 'आगे',
  Back: 'पीछे',
  'Suggestions come from products currently in stock. Prices are shown as listed in the store.':
    'सुझाव अभी स्टॉक में मौजूद प्रोडक्ट्स से हैं। क़ीमतें स्टोर में सूचीबद्ध अनुसार दिखती हैं।',
  'Sample data in this preview. The theme uses your real catalogue.':
    'इस प्रीव्यू में नमूना डेटा। थीम आपकी असली कैटलॉग उपयोग करती है।',
  'Live products from {store}': '{store} के लाइव प्रोडक्ट',
  'Nothing is tagged for {occasion} yet, so these are {recipient} ideas in your budget.':
    '{occasion} के लिए अभी कुछ टैग नहीं है, इसलिए आपके बजट में ये {recipient} विकल्प हैं।',
  'No exact match for {recipient}, so these are {occasion} ideas in your budget.':
    '{recipient} के लिए सटीक मैच नहीं, इसलिए आपके बजट में ये {occasion} विकल्प हैं।',
  'this occasion': 'इस अवसर',
  'this recipient': 'इस पाने वाले',
  general: 'सामान्य',

  // Recently viewed + wishlist
  'Pick up where you left off': 'जहाँ छोड़ा वहीं से',
  'Recently viewed': 'हाल में देखे गए',
  'Saved on this device': 'इस डिवाइस पर सहेजा गया',
  "Hover over a few products. In the live theme this list is kept in the shopper's browser only.":
    'कुछ प्रोडक्ट पर कर्सर ले जाएँ। लाइव थीम में यह सूची केवल ग्राहक के ब्राउज़र में रहती है।',
  "Tap the heart on any product to save it here. It doesn't sync across devices.":
    'किसी भी प्रोडक्ट पर दिल दबाकर यहाँ सहेजें। यह डिवाइस के बीच सिंक नहीं होता।',

  // Brands A–Z
  'Brand directory': 'ब्रांड डायरेक्टरी',
  'Brands A–Z': 'ब्रांड्स A–Z',
  'In the live theme this list builds itself from your product vendors, so each brand appears once and only if it has products.':
    'लाइव थीम में यह सूची आपके प्रोडक्ट वेंडर से स्वतः बनती है, इसलिए हर ब्रांड एक बार और तभी दिखता है जब उसके प्रोडक्ट हों।',
  'Search {count} brands': '{count} ब्रांड खोजें',
  'No brand matches your search.': 'आपकी खोज से कोई ब्रांड नहीं मिला।',
  'Search brands': 'ब्रांड खोजें',
  'Brands by letter': 'अक्षर से ब्रांड',

  // Budget section
  'Gifting made easy': 'गिफ्टिंग आसान',
  'Shop by budget': 'बजट से खरीदें',
  'In the live theme each card links to a price-based collection you create once real prices are entered.':
    'लाइव थीम में हर कार्ड असली क़ीमतें भरने के बाद बनाए गए क़ीमत-आधारित कलेक्शन से जुड़ता है।',
  Under: 'अंडर',
  'Treat yourself': 'ख़ुद के लिए',
  'Premium Picks': 'प्रीमियम पिक्स',

  // Edit stories
  'The Beauty & Skincare Edit': 'ब्यूटी व स्किनकेयर एडिट',
  'Gentle routines for every skin': 'हर त्वचा के लिए कोमल देखभाल',
  'Cleansers, serums, moisturisers and sunscreens chosen from the brands on our shelves.':
    'हमारी अलमारी के ब्रांड्स में से चुने क्लेंज़र, सीरम, मॉइस्चराइज़र व सनस्क्रीन।',
  Serums: 'सीरम',
  Sunscreen: 'सनस्क्रीन',
  Moisturisers: 'मॉइस्चराइज़र',
  'Comfort, in every size': 'हर साइज़ में आराम',
  'Everyday innerwear and hosiery for men, women and kids from Jockey, Van Heusen, Zoiro, Sunny, Bodycare and Lady Care.':
    'Jockey, Van Heusen, Zoiro, Sunny, Bodycare और Lady Care की पुरुषों, महिलाओं और बच्चों के लिए रोज़मर्रा की इनरवियर व होज़ियरी।',
  "Zoiro · Men's Nikar": 'Zoiro · पुरुष निक्कर',
  'Bodycare · Women': 'Bodycare · महिलाएँ',
  'Bodycare · Kids Boys': 'Bodycare · बच्चे (लड़के)',
  'Bodycare · Kids Girls': 'Bodycare · बच्चे (लड़कियाँ)',
  'Lady Care · Women': 'Lady Care · महिलाएँ',
  'Gifts, Toys & Jewellery': 'गिफ्ट, खिलौने व ज्वेलरी',
  'Little joys, thoughtfully wrapped': 'छोटी-छोटी ख़ुशियाँ, प्यार से लिपटी',
  'Gift articles, toys for little ones and imitation jewellery for every celebration.':
    'हर जश्न के लिए गिफ्ट आर्टिकल्स, बच्चों के खिलौने और इमिटेशन ज्वेलरी।',
  'Gift articles': 'गिफ्ट आर्टिकल्स',
  Accessories: 'एक्सेसरीज़',

  // Newsletter
  Newsletter: 'न्यूज़लेटर',
  'Be the first to know': 'सबसे पहले जानें',
  'New arrivals and store updates. Unsubscribe any time.':
    'नए प्रोडक्ट और स्टोर अपडेट। कभी भी अनसब्सक्राइब करें।',
  'Your email address': 'आपका ईमेल पता',
  Subscribe: 'सब्सक्राइब करें',
  'Email address': 'ईमेल पता',
  'Preview only. On Shopify, {email} would be saved as a customer with email marketing consent.':
    'केवल प्रीव्यू। Shopify पर {email} ईमेल मार्केटिंग सहमति के साथ ग्राहक के रूप में सहेजा जाता।',

  // Footer
  'A multi-brand store for beauty, skincare, haircare, innerwear, kids\' toys, gifts and imitation jewellery.':
    'ब्यूटी, स्किनकेयर, हेयरकेयर, इनरवियर, बच्चों के खिलौने, गिफ्ट और इमिटेशन ज्वेलरी का मल्टी-ब्रांड स्टोर।',
  'Customer care': 'ग्राहक सेवा',
  'Visit us': 'हमसे मिलें',
  'Shop all': 'सब खरीदें',
  Contact: 'संपर्क',
  'Shipping policy': 'शिपिंग नीति',
  'Refund policy': 'रिफंड नीति',
  'Privacy policy': 'गोपनीयता नीति',
  'Terms of service': 'सेवा की शर्तें',
  'View on Google Maps': 'Google Maps पर देखें',
  'All rights reserved.': 'सर्वाधिकार सुरक्षित।',
  'Policies are listed automatically from Shopify Admin.':
    'नीतियाँ Shopify Admin से स्वतः जुड़ती हैं।',

  // Language switcher
  Language: 'भाषा',
  'Change language': 'भाषा बदलें',
  'Interface language for this preview. Full storefront translation is configured in Shopify.':
    'इस प्रीव्यू की इंटरफ़ेस भाषा। पूरा स्टोरफ्रंट अनुवाद Shopify में कॉन्फ़िगर होता है।',

  // Festival countdown
  Festival: 'त्योहार',
  'Ends in': 'शेष समय',
  Days: 'दिन',
  Hours: 'घंटे',
  Minutes: 'मिनट',
  Seconds: 'सेकंड',
  'Find a Gift': 'गिफ्ट खोजें',
  'This festival period has ended. Stay tuned for the next one!':
    'त्योहार का समय समाप्त। अगले त्योहार की जल्दी ख़बर!',
};

const GU: Record<string, string> = {
  // Preview banner
  'Visual preview with sample data. The Shopify theme shows your real products, prices and brands.':
    'નમૂના ડેટા સાથે વિઝ્યુઅલ પ્રીવ્યૂ. Shopify થીમ તમારા વાસ્તવિક પ્રોડક્ટ, કિંમત અને બ્રાન્ડ બતાવે છે.',
  'Download theme & guides': 'થીમ અને ગાઇડ ડાઉનલોડ કરો',

  // Announcement bar
  'Beauty, innerwear, gifts & more — curated in Ahmedabad':
    'બ્યૂટી, ઇનરવેર, ગિફ્ટ અને ઘણું બધું — અમદાવાદમાં પસંદ કરેલું',
  'Explore original products from brands you trust':
    'તમારા ભરોસાપાત્ર બ્રાન્ડના અસલી પ્રોડક્ટ જુઓ',
  'Previous announcement': 'પાછલી જાહેરાત',
  'Next announcement': 'આગલી જાહેરાત',

  // Header / nav
  'Shop All': 'બધું ખરીદો',
  'Beauty & Skincare': 'બ્યૂટી અને સ્કિનકેર',
  Haircare: 'હેરકેર',
  Makeup: 'મેકઅપ',
  'Hosiery & Innerwear': 'હોઝિયરી અને ઇનરવેર',
  'Kids & Toys': 'બાળકો અને રમકડાં',
  'Gifts & Jewellery': 'ગિફ્ટ અને જ્વેલરી',
  'Beauty Tools': 'બ્યૂટી ટૂલ્સ',
  Brands: 'બ્રાન્ડ',
  Offers: 'ઓફર',
  'Shop by Department': 'વિભાગ પ્રમાણે ખરીદો',
  'Shop by Brand': 'બ્રાન્ડ પ્રમાણે ખરીદો',
  'Shop by Product Type': 'પ્રોડક્ટ ટાઇપ પ્રમાણે ખરીદો',
  'Gift Articles': 'ગિફ્ટ આર્ટિકલ',
  'Imitation Jewellery': 'ઇમિટેશન જ્વેલરી',
  'Beauty Tools & Grooming': 'બ્યૂટી ટૂલ્સ અને ગ્રૂમિંગ',
  'Accessories & More': 'એક્સેસરી અને વધુ',
  'Face Wash': 'ફેસ વોશ',
  Moisturizer: 'મોઇશ્ચરાઇઝર',
  Serum: 'સીરમ',
  Shampoo: 'શેમ્પૂ',
  Conditioner: 'કન્ડીશનર',
  'Lip Products': 'લિપ પ્રોડક્ટ',
  'Makeup Products': 'મેકઅપ પ્રોડક્ટ',
  Innerwear: 'ઇનરવેર',
  Toys: 'રમકડાં',
  Gifts: 'ગિફ્ટ',
  'Show Shop All menu': 'બધું ખરીદો મેનૂ બતાવો',
  Search: 'શોધો',
  Wishlist: 'વિશલિસ્ટ',
  'Bag, {count} items': 'બેગ, {count} વસ્તુ',
  'Open menu': 'મેનૂ ખોલો',
  'Close menu': 'મેનૂ બંધ કરો',
  Menu: 'મેનૂ',
  'Search the store': 'સ્ટોરમાં શોધો',
  'Search products, brands, categories…': 'પ્રોડક્ટ, બ્રાન્ડ, શ્રેણી શોધો…',
  Clear: 'સાફ કરો',
  'Close search': 'શોધ બંધ કરો',
  Products: 'પ્રોડક્ટ',
  'No brand match': 'કોઈ બ્રાન્ડ મળ્યું નથી',
  'No products found for “{query}”. Try a brand name like “Lakmé” or a type like “shampoo”.':
    '“{query}” માટે કોઈ પ્રોડક્ટ મળ્યું નથી. “Lakmé” જેવું બ્રાન્ડ અથવા “શેમ્પૂ” જેવો ટાઇપ અઝમાવો.',
  'Popular searches': 'લોકપ્રિય શોધ',
  'Face wash': 'ફેસ વોશ',
  Lipstick: 'લિપસ્ટિક',
  Brief: 'બ્રીફ',
  Gift: 'ગિફ્ટ',
  Bangle: 'ચૂડી',
  Main: 'મુખ્ય',
  'Featured brands, scroll horizontally': 'પસંદ કરેલા બ્રાન્ડ, આડા સ્ક્રોલ કરો',
  'The Edit': 'એડિટ',
  'Everyday skincare essentials': 'રોજિંદા સ્કિનકેર જરૂરિયાત',

  // Hero
  'Mahadev — Ahmedabad': 'મહાદેવ — અમદાવાદ',
  'Beauty, care & gifting,': 'બ્યૂટી, સંભાળ અને ગિફ્ટિંગ,',
  'beautifully curated.': 'સુંદર રીતે પસંદ કરેલું.',
  'Skincare, makeup, haircare, innerwear, toys and thoughtful gifts from the brands you know, all in one considered store.':
    'તમારા જાણીતા બ્રાન્ડના સ્કિનકેર, મેકઅપ, હેરકેર, ઇનરવેર, રમકડાં અને વિચારસરણીય ગિફ્ટ — બધું એક જ સ્ટોરમાં.',
  'Shop Now': 'હવે ખરીદો',
  'Explore Brands': 'બ્રાન્ડ જુઓ',
  'Imitation jewellery': 'ઇમિટેશન જ્વેલરી',
  'Curated beauty, gifts and jewellery arranged on cream linen':
    'ક્રીમ લિનન પર સજાવેલી બ્યૂટી, ગિફ્ટ અને જ્વેલરી',

  // Departments
  Departments: 'વિભાગ',
  'Shop by department': 'વિભાગ પ્રમાણે ખરીદો',
  'Shop all': 'બધું જુઓ',
  'Find it fast': 'ઝટપટ શોધો',
  'Face Cream': 'ફેસ ક્રીમ',
  'Makeup & Cosmetics': 'મેકઅપ અને કોસ્મેટિક્સ',
  'Lips, eyes, face': 'હોઠ, આંખ, ચહેરો',
  Skincare: 'સ્કિનકેર',
  'Cleanse, treat, protect': 'સફાઈ, સંભાળ, સુરક્ષા',
  'Everyday & professional': 'રોજિંદું અને પ્રોફેશનલ',
  'Men, women & kids': 'પુરુષ, સ્ત્રી અને બાળકો',
  'Play & learn': 'રમો અને શીખો',
  'For every occasion': 'દરેક પ્રસંગ માટે',
  'Everyday sparkle': 'રોજની ચમક',
  'Brushes, combs, trimmers': 'બ્રશ, કાંગ, ટ્રિમર',

  // Featured brands
  'Brands we stock': 'અમારા બ્રાન્ડ',
  'Featured brands': 'પસંદ કરેલા બ્રાન્ડ',
  'All brands A–Z': 'બધા બ્રાન્ડ A–Z',
  Shop: 'ખરીદો',
  "Men's nikar / underwear only": 'ફક્ત પુરુષોની નિક્કર/અંડરવેર',
  'Kids (boys, girls) & women only': 'ફક્ત બાળકો (છોકરા, છોકરીઓ) અને સ્ત્રીઓ માટે',
  "Women's nikar / panty only": 'ફક્ત સ્ત્રીઓની નિક્કર/પેન્ટી',
  'Skincare, face & haircare — never makeup': 'સ્કિનકેર, ફેસ અને હેરકેર — ક્યારેય મેકઅપ નહીં',

  // Product rows
  'Trending now': 'હમણાં ટ્રેન્ડિંગ',
  'Trending products': 'ટ્રેન્ડિંગ પ્રોડક્ટ',
  'Just in': 'હમણાં આવ્યું',
  'New arrivals': 'નવા પ્રોડક્ટ',
  'View all': 'બધું જુઓ',
  'Genuine savings': 'સાચી બચત',

  // Product card
  'Sold out': 'વિકાઈ ગયું',
  '{n}% off': '{n}% છૂટ',
  'Quick add': 'ઝટપટ ઉમેરો',
  Add: 'ઉમેરો',
  'Save {title} to wishlist': '{title} વિશલિસ્ટમાં સાચવો',
  'Decrease quantity': 'જથ્થો ઘટાડો',
  'Increase quantity': 'જથ્થો વધારો',

  // Product page preview
  'Product page preview': 'પ્રોડક્ટ પેજ પ્રીવ્યૂ',
  'Inclusive of all taxes. Shipping calculated at checkout.':
    'બધા કર સામેલ. શિપિંગની ગણતરી ચેકઆઉટ પર.',
  'Size:': 'સાઇઝ:',
  'In stock': 'સ્ટોકમાં',
  'Add to bag': 'બેગમાં ઉમેરો',
  'Order on WhatsApp': 'WhatsApp પર ઓર્ડર કરો',
  '(opens WhatsApp in a new window)': '(નવી વિન્ડોમાં WhatsApp ખૂલે છે)',
  'WhatsApp orders are confirmed only after we reply with availability and the final price. Nothing is charged until you confirm with the store.':
    'WhatsApp ઓર્ડર ત્યારે જ પક્કો થાય છે જ્યારે અમે ઉપલબ્ધતા અને અંતિમ કિંમત જણાવીએ. સ્ટોરની પુષ્ટિ થાય ત્યાં સુધી કંઈ ચાર્જ થતું નથી.',
  'Message the shopper sends': 'ગ્રાહક જે સંદેશ મોકલે છે',
  "Preview: the store's number is set in Theme settings → WhatsApp ordering. This preview opens a chat with {number}.":
    'પ્રીવ્યૂ: સ્ટોરનો નંબર થીમ સેટિંગ્સ → WhatsApp ઓર્ડરિંગમાં સેટ થાય છે. આ પ્રીવ્યૂ {number} સાથે ચેટ ખોલે છે.',

  // Gift wrap
  'Add gift wrapping': 'ગિફ્ટ રેપિંગ ઉમેરો',
  'Gift wrapping is offered free by the store.': 'ગિફ્ટ રેપિંગ સ્ટોર તરફથી મફત છે.',
  'Gift wrapping is added as the product “{title}” at {price}.':
    'ગિફ્ટ રેપિંગ “{title}” પ્રોડક્ટ તરીકે {price} પર ઉમેરાય છે.',
  'Gift message (optional)': 'ગિફ્ટ સંદેશ (વૈકલ્પિક)',
  'Max {count} characters': 'મહત્તમ {count} અક્ષર',
  '{count} characters left': '{count} અક્ષર બાકી',
  'Gift wrap': 'ગિફ્ટ રેપિંગ',
  'Gift message': 'ગિફ્ટ સંદેશ',
  Yes: 'હા',
  'Wrapping fee': 'રેપિંગ ફી',

  // Cart
  'Your bag': 'તમારી બેગ',
  'Shopping bag': 'શોપિંગ બેગ',
  'Close bag': 'બેગ બંધ કરો',
  'Your bag is empty': 'તમારી બેગ ખાલી છે',
  'Discover skincare, makeup, innerwear and thoughtful gifts.':
    'સ્કિનકેર, મેકઅપ, ઇનરવેર અને વિચારસરણીય ગિફ્ટ જુઓ.',
  Remove: 'દૂર કરો',
  Subtotal: 'ઉપકુલ',
  'Taxes and shipping are calculated at checkout.': 'કર અને શિપિંગ ચેકઆઉટ પર ગણવામાં આવે છે.',
  Checkout: 'ચેકઆઉટ',
  'Preview only. On Shopify this button opens native checkout.':
    'ફક્ત પ્રીવ્યૂ. Shopify પર આ બટન નેટિવ ચેકઆઉટ ખોલે છે.',
  "In the real theme this opens Shopify's native checkout":
    'અસલી થીમમાં આ Shopifyનું નેટિવ ચેકઆઉટ ખોલે છે',

  // Gift finder
  'Festive gift finder': 'તહેવારી ગિફ્ટ ફાઇન્ડર',
  'Find the perfect gift in three taps': 'ત્રણ ટેપમાં એકદમ યોગ્ય ગિફ્ટ શોધો',
  "Tell us the occasion, who it's for and your budget. We'll suggest in-stock gifts from our shelves.":
    'પ્રસંગ, ગિફ્ટ કોના માટે છે અને તમારું બજેટ જણાવો. અમે સ્ટોકમાંથી ઉપલબ્ધ ગિફ્ટ સૂચવીશું.',
  Occasion: 'પ્રસંગ',
  'For whom': 'કોના માટે',
  Budget: 'બજેટ',
  "What's the occasion?": 'પ્રસંગ શું છે?',
  'Who is it for?': 'આ કોના માટે છે?',
  "What's your budget?": 'તમારું બજેટ શું છે?',
  Diwali: 'દિવાળી',
  'Lights & sweets': 'રોશની અને મીઠાઈ',
  'Raksha Bandhan': 'રક્ષા બંધન',
  'For siblings': 'ભાઈ-બહેન માટે',
  'Bhai Dooj': 'ભાઈ બીજ',
  Birthday: 'જન્મદિવસ',
  'Any age': 'કોઈપણ ઉંમર',
  'Wedding & anniversary': 'લગ્ન અને વર્ષગાંઠ',
  'Shagun & return gifts': 'શગણ અને રિટર્ન ગિફ્ટ',
  'Just because': 'બસ એમ ને એમ',
  'Any occasion': 'કોઈપણ પ્રસંગ',
  'For her': 'સ્ત્રી માટે',
  'Mother, sister, friend': 'માતા, બહેન, મિત્ર',
  'For him': 'પુરુષ માટે',
  'Father, brother, friend': 'પિતા, ભાઈ, મિત્ર',
  'For kids': 'બાળકો માટે',
  'Little ones': 'નાના બાળકો',
  'For the family': 'પરિવાર માટે',
  'Home & hampers': 'ઘર અને હેમ્પર',
  Anyone: 'કોઈપણ',
  'Surprise me': 'સરપ્રાઇઝ આપો',
  'Under ₹300': '₹300 સુધી',
  '₹1,500 & above': '₹1,500 અને વધુ',
  'Any budget': 'કોઈપણ બજેટ',
  'Your gift ideas': 'તમારા ગિફ્ટ આઇડિયા',
  '1 idea': '1 વિકલ્પ',
  '{count} ideas': '{count} વિકલ્પ',
  'Start again': 'ફરી શરૂ કરો',
  'No matching gifts right now': 'હમણાં કોઈ યોગ્ય ગિફ્ટ નથી',
  "Nothing in stock matches these choices at the moment. Try another budget or recipient, or ask us. We'll gladly help in store or on WhatsApp.":
    'આ ક્ષણે આ પસંદગીઓ પર સ્ટોકમાં કંઈ નથી. બીજું બજેટ કે પામનાર અઝમાવો, અથવા અમને પૂછો. અમે સ્ટોર કે WhatsApp પર મદદ કરીશું.',
  'Change my choices': 'પસંદગી બદલો',
  'Browse all products': 'બધા પ્રોડક્ટ જુઓ',
  'Show gift ideas': 'ગિફ્ટ આઇડિયા બતાવો',
  Next: 'આગળ',
  Back: 'પાછળ',
  'Suggestions come from products currently in stock. Prices are shown as listed in the store.':
    'સૂચનો હમણાં સ્ટોકમાં રહેલા પ્રોડક્ટમાંથી છે. કિંમતો સ્ટોરમાં સૂચિબદ્ધ મુજબ બતાવવામાં આવે છે.',
  'Sample data in this preview. The theme uses your real catalogue.':
    'આ પ્રીવ્યૂમાં નમૂના ડેટા. થીમ તમારું વાસ્તવિક કેટેલોગ વાપરે છે.',
  'Live products from {store}': '{store} ના લાઇવ પ્રોડક્ટ',
  'Nothing is tagged for {occasion} yet, so these are {recipient} ideas in your budget.':
    '{occasion} માટે હજી કંઈ ટૅગ નથી, એટલે તમારા બજેટમાં આ {recipient} વિકલ્પ છે.',
  'No exact match for {recipient}, so these are {occasion} ideas in your budget.':
    '{recipient} માટે સચોટ મેચ નથી, એટલે તમારા બજેટમાં આ {occasion} વિકલ્પ છે.',
  'this occasion': 'આ પ્રસંગ',
  'this recipient': 'આ પામનાર',
  general: 'સામાન્ય',

  // Recently viewed + wishlist
  'Pick up where you left off': 'જ્યાં છોડ્યું ત્યાંથી',
  'Recently viewed': 'તાજેતરમાં જોયેલા',
  'Saved on this device': 'આ ડિવાઇસ પર સાચવેલા',
  "Hover over a few products. In the live theme this list is kept in the shopper's browser only.":
    'કેટલાક પ્રોડક્ટ પર કર્સર લઈ જાઓ. લાઇવ થીમમાં આ યાદી ફક્ત ગ્રાહકના બ્રાઉઝરમાં રહે છે.',
  "Tap the heart on any product to save it here. It doesn't sync across devices.":
    'કોઈપણ પ્રોડક્ટ પર હૃદય દબાવીને અહીં સાચવો. તે ડિવાઇસ વચ્ચે સિંક થતું નથી.',

  // Brands A–Z
  'Brand directory': 'બ્રાન્ડ ડિરેક્ટરી',
  'Brands A–Z': 'બ્રાન્ડ A–Z',
  'In the live theme this list builds itself from your product vendors, so each brand appears once and only if it has products.':
    'લાઇવ થીમમાં આ યાદી તમારા પ્રોડક્ટ વેન્ડરમાંથી આપોઆપ બને છે, એટલે દરેક બ્રાન્ડ એક જ વાર અને ત્યારે જ દેખાય છે જ્યારે તેના પ્રોડક્ટ હોય.',
  'Search {count} brands': '{count} બ્રાન્ડ શોધો',
  'No brand matches your search.': 'તમારી શોધ સાથે કોઈ બ્રાન્ડ મળ્યું નથી.',
  'Search brands': 'બ્રાન્ડ શોધો',
  'Brands by letter': 'અક્ષર પ્રમાણે બ્રાન્ડ',

  // Budget section
  'Gifting made easy': 'ગિફ્ટિંગ સરળ',
  'Shop by budget': 'બજેટ પ્રમાણે ખરીદો',
  'In the live theme each card links to a price-based collection you create once real prices are entered.':
    'લાઇવ થીમમાં દરેક કાર્ડ વાસ્તવિક કિંમતો નાખ્યા પછી બનાવેલા કિંમત-આધારિત કલેક્શન સાથે જોડાય છે.',
  Under: 'અંડર',
  'Treat yourself': 'પોતાના માટે',
  'Premium Picks': 'પ્રીમિયમ પિક્સ',

  // Edit stories
  'The Beauty & Skincare Edit': 'બ્યૂટી અને સ્કિનકેર એડિટ',
  'Gentle routines for every skin': 'દરેક ત્વચા માટે કોમળ સંભાળ',
  'Cleansers, serums, moisturisers and sunscreens chosen from the brands on our shelves.':
    'અમારી અલમારીના બ્રાન્ડમાંથી પસંદ કરેલા ક્લેન્ઝર, સીરમ, મોઇશ્ચરાઇઝર અને સનસ્ક્રીન.',
  Serums: 'સીરમ',
  Sunscreen: 'સનસ્ક્રીન',
  Moisturisers: 'મોઇશ્ચરાઇઝર',
  'Comfort, in every size': 'દરેક સાઇઝમાં આરામ',
  'Everyday innerwear and hosiery for men, women and kids from Jockey, Van Heusen, Zoiro, Sunny, Bodycare and Lady Care.':
    'Jockey, Van Heusen, Zoiro, Sunny, Bodycare અને Lady Care ના પુરુષો, સ્ત્રીઓ અને બાળકો માટે રોજિંદા ઇનરવેર અને હોઝિયરી.',
  "Zoiro · Men's Nikar": 'Zoiro · પુરુષ નિક્કર',
  'Bodycare · Women': 'Bodycare · સ્ત્રીઓ',
  'Bodycare · Kids Boys': 'Bodycare · બાળકો (છોકરા)',
  'Bodycare · Kids Girls': 'Bodycare · બાળકો (છોકરીઓ)',
  'Lady Care · Women': 'Lady Care · સ્ત્રીઓ',
  'Gifts, Toys & Jewellery': 'ગિફ્ટ, રમકડાં અને જ્વેલરી',
  'Little joys, thoughtfully wrapped': 'નાની-નાની ખુશીઓ, પ્રેમથી લિપટેલી',
  'Gift articles, toys for little ones and imitation jewellery for every celebration.':
    'દરેક ઉજવણી માટે ગિફ્ટ આર્ટિકલ, બાળકોના રમકડાં અને ઇમિટેશન જ્વેલરી.',
  'Gift articles': 'ગિફ્ટ આર્ટિકલ',
  Accessories: 'એક્સેસરી',

  // Newsletter
  Newsletter: 'ન્યૂઝલેટર',
  'Be the first to know': 'સૌથી પહેલા જાણો',
  'New arrivals and store updates. Unsubscribe any time.':
    'નવા પ્રોડક્ટ અને સ્ટોર અપડેટ. ગમે ત્યારે અનસબ્સ્ક્રાઇબ કરો.',
  'Your email address': 'તમારું ઈમેલ સરનામું',
  Subscribe: 'સબ્સ્ક્રાઇબ કરો',
  'Email address': 'ઈમેલ સરનામું',
  'Preview only. On Shopify, {email} would be saved as a customer with email marketing consent.':
    'ફક્ત પ્રીવ્યૂ. Shopify પર {email} ઈમેલ માર્કેટિંગ સંમતિ સાથે ગ્રાહક તરીકે સાચવાતું.',

  // Footer
  'A multi-brand store for beauty, skincare, haircare, innerwear, kids\' toys, gifts and imitation jewellery.':
    'બ્યૂટી, સ્કિનકેર, હેરકેર, ઇનરવેર, બાળકોના રમકડાં, ગિફ્ટ અને ઇમિટેશન જ્વેલરીનું મલ્ટી-બ્રાન્ડ સ્ટોર.',
  'Customer care': 'ગ્રાહક સેવા',
  'Visit us': 'અમને મળો',
  'Shop all': 'બધું ખરીદો',
  Contact: 'સંપર્ક',
  'Shipping policy': 'શિપિંગ નીતિ',
  'Refund policy': 'રીફંડ નીતિ',
  'Privacy policy': 'ગોપનીયતા નીતિ',
  'Terms of service': 'સેવાની શરતો',
  'View on Google Maps': 'Google Maps પર જુઓ',
  'All rights reserved.': 'સર્વ હક અમારી પાસે.',
  'Policies are listed automatically from Shopify Admin.':
    'નીતિઓ Shopify Admin માંથી આપોઆપ જોડાય છે.',

  // Language switcher
  Language: 'ભાષા',
  'Change language': 'ભાષા બદલો',
  'Interface language for this preview. Full storefront translation is configured in Shopify.':
    'આ પ્રીવ્યૂની ઇન્ટરફેસ ભાષા. સંપૂર્ણ સ્ટોરફ્રન્ટ અનુવાદ Shopifyમાં ગોઠવાય છે.',

  // Festival countdown
  Festival: 'તહેવાર',
  'Ends in': 'બાકી સમય',
  Days: 'દિવસ',
  Hours: 'કલાક',
  Minutes: 'મિનિટ',
  Seconds: 'સેકન્ડ',
  'Find a Gift': 'ગિફ્ટ શોધો',
  'This festival period has ended. Stay tuned for the next one!':
    'તહેવારનો સમય પૂરો થયો. આગલી ઉજવણી માટે જોતા રહો!',
};

const DICTS: Record<Exclude<Lang, 'en'>, Record<string, string>> = { hi: HI, gu: GU };

// ── Public helpers ───────────────────────────────────────────────────────────

export function translate(lang: Lang, text: string): string {
  if (lang === 'en') return text;
  return DICTS[lang][text] ?? text;
}

export function translateFormat(
  lang: Lang,
  pattern: string,
  vars: Record<string, string | number>,
): string {
  const translated = translate(lang, pattern);
  return translated.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export function useLang() {
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getServerLang);
  return {
    lang,
    t: (text: string) => translate(lang, text),
    tf: (pattern: string, vars: Record<string, string | number>) =>
      translateFormat(lang, pattern, vars),
  };
}

'use client';

// MAHADEV CUTLERY & GIFT ARTICLES — Shopify theme preview & delivery.
// Single route by design: the default view is the one-page boutique preview
// (a faithful copy of the approved reference design) running on clearly
// labelled SAMPLE data; the preview banner opens the Delivery view with the
// theme ZIP, import templates and guides; the honest verification report is
// reachable from there.

import { useEffect, useState } from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import { AnnouncementBar } from '@/components/mc/boutique/announcement-bar';
import { FestivalCountdown } from '@/components/mc/boutique/festival-countdown';
import { Header } from '@/components/mc/boutique/header';
import {
  BudgetSection,
  Departments,
  EditSection,
  FeaturedBrands,
  Hero,
  ProductTypes,
} from '@/components/mc/boutique/sections';
import { ProductRow } from '@/components/mc/boutique/product-card';
import { ProductPagePreview } from '@/components/mc/boutique/product-page-preview';
import { GiftFinder } from '@/components/mc/boutique/gift-finder';
import { BrandsAZ } from '@/components/mc/boutique/brands-az';
import { RecentlyWishlist } from '@/components/mc/boutique/recently-wishlist';
import { Newsletter, Footer } from '@/components/mc/boutique/footer';
import { CartDrawer } from '@/components/mc/boutique/cart-drawer';
import { DeliveryView } from '@/components/mc/delivery-view';
import { ReportView } from '@/components/mc/report-view';
import { BoutiqueProvider } from '@/lib/boutique-store';
import { useLang } from '@/lib/i18n';
import { NEW_ARRIVALS, OFFER_PRODUCTS, PRODUCTS } from '@/lib/boutique';

type AppView = 'boutique' | 'delivery' | 'report';
type Catalog = { products: typeof PRODUCTS; loaded: boolean };

function PreviewBanner({ onDelivery }: { onDelivery: () => void }) {
  const { t } = useLang();
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-blush px-4 py-2 text-center text-[12.5px] text-[#4A3320]"
      data-testid="preview-banner"
    >
      <span>
        <Eye className="mr-1.5 inline size-3.5 align-[-2px]" />
        {t(
          'Visual preview with sample data. The Shopify theme shows your real products, prices and brands.',
        )}
      </span>
      <button
        type="button"
        onClick={onDelivery}
        className="inline-flex items-center gap-1 font-semibold underline underline-offset-[3px]"
        data-testid="preview-banner-delivery-link"
      >
        {t('Download theme & guides')}
        <ArrowRight className="size-3.5" />
      </button>
    </div>
  );
}

function BoutiquePage({ products, onDelivery }: { products: typeof PRODUCTS; onDelivery: () => void }) {
  return (
    <div id="top" className="min-h-screen bg-paper text-ink">
      <PreviewBanner onDelivery={onDelivery} />
      <AnnouncementBar />
      <FestivalCountdown />
      <Header />
      <main>
        <Hero />
        <Departments />
        <FeaturedBrands />
        <ProductRow
          id="trending"
          eyebrow="Trending now"
          title="Trending products"
          products={products}
          carousel
        />
        <ProductPagePreview p={products[2]} />
        <ProductRow
          id="new-arrivals"
          eyebrow="Just in"
          title="New arrivals"
          products={NEW_ARRIVALS}
          bg="bg-warm"
        />
        <ProductTypes />
        <EditSection
          id="skincare-edit"
          eyebrow="The Beauty & Skincare Edit"
          title="Gentle routines for every skin"
          text="Cleansers, serums, moisturisers and sunscreens chosen from the brands on our shelves."
          image="editorial-skincare"
          tone="bg-cream"
          chips={['Face wash', 'Serums', 'Sunscreen', 'Moisturisers', 'Lotus Herbals', 'Cetaphil']}
          products={products.slice(0, 2)}
        />
        <EditSection
          id="innerwear-edit"
          eyebrow="Hosiery & Innerwear"
          title="Comfort, in every size"
          text="Everyday innerwear and hosiery for men, women and kids from Jockey, Van Heusen, Zoiro, Sunny, Bodycare and Lady Care."
          image="dept-innerwear"
          tone="bg-paper"
          right
          chips={[
            'Jockey',
            'Van Heusen',
            "Zoiro · Men's Nikar",
            'Sunny',
            'Bodycare · Women',
            'Bodycare · Kids Boys',
            'Bodycare · Kids Girls',
            'Lady Care · Women',
          ]}
          products={[products[4], products[2]]}
        />
        <EditSection
          id="gifts-edit"
          eyebrow="Gifts, Toys & Jewellery"
          title="Little joys, thoughtfully wrapped"
          text="Gift articles, toys for little ones and imitation jewellery for every celebration."
          image="dept-gifts"
          tone="bg-blush"
          chips={['Toys', 'Gift articles', 'Imitation jewellery', 'Accessories']}
          products={[products[6], products[3]]}
        />
        <GiftFinder products={products} />
        <BudgetSection />
        <ProductRow id="offers" eyebrow="Offers" title="Genuine savings" products={OFFER_PRODUCTS} />
        <RecentlyWishlist />
        <BrandsAZ />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function Page() {
  const [view, setView] = useState<AppView>('boutique');
  const [catalog, setCatalog] = useState<Catalog>({ products: PRODUCTS, loaded: false });

  // Keep the /api/demo-products contract alive: prefer the API response and
  // fall back to the identical in-repo sample data if the request fails.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch('/api/demo-products');
        if (!response.ok) throw new Error(`status ${response.status}`);
        const data: { products: Catalog['products'] } = await response.json();
        if (!cancelled && Array.isArray(data.products) && data.products.length) {
          setCatalog({ products: data.products, loaded: true });
        }
      } catch {
        // API unavailable — the static sample catalogue (identical) is used.
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const openView = (next: AppView) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  if (view === 'delivery') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-[var(--mc-border)] bg-[var(--mc-bg-soft)]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => openView('boutique')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--mc-ink)] underline underline-offset-4 hover:text-[var(--mc-accent)]"
            >
              ← Back to the preview
            </button>
            <button
              type="button"
              onClick={() => openView('report')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--mc-ink)] underline underline-offset-4 hover:text-[var(--mc-accent)]"
            >
              Verification report
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
        <DeliveryView />
      </div>
    );
  }

  if (view === 'report') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-[var(--mc-border)] bg-[var(--mc-bg-soft)]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => openView('boutique')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--mc-ink)] underline underline-offset-4 hover:text-[var(--mc-accent)]"
            >
              ← Back to the preview
            </button>
            <button
              type="button"
              onClick={() => openView('delivery')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--mc-ink)] underline underline-offset-4 hover:text-[var(--mc-accent)]"
            >
              Theme delivery &amp; guides
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
        <ReportView />
      </div>
    );
  }

  return (
    <BoutiqueProvider>
      <BoutiquePage products={catalog.products} onDelivery={() => openView('delivery')} />
    </BoutiqueProvider>
  );
}

'use client';

// MAHADEV CUTLERY & GIFT ARTICLES — Theme Studio & Preview.
// The ONLY page of the showcase app (single-route by design, SPEC §6).
// All views are switched with client tabs; the catalogue is fetched from
// /api/demo-products (with the static sample catalogue as honest fallback).

import { useCallback, useEffect, useState } from 'react';
import { AnnouncementBar } from '@/components/mc/announcement-bar';
import { Header, type AppTab } from '@/components/mc/header';
import { Footer } from '@/components/mc/footer';
import { StorefrontPreview } from '@/components/mc/storefront-preview';
import { GiftFinder } from '@/components/mc/gift-finder';
import { ProductDemo } from '@/components/mc/product-demo';
import { CartDrawer } from '@/components/mc/cart-drawer';
import { WishlistView } from '@/components/mc/wishlist-view';
import { DeliveryView } from '@/components/mc/delivery-view';
import { ReportView } from '@/components/mc/report-view';
import { DEMO_PRODUCTS, type DemoProduct } from '@/lib/catalog';

type Catalog = { products: DemoProduct[]; loading: boolean };

export default function Page() {
  const [tab, setTab] = useState<AppTab>('storefront');
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [selectedHandle, setSelectedHandle] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Catalog>({
    products: [],
    loading: true,
  });

  // Fetch the sample catalogue from the API contract route. Falls back to
  // the identical static import if the request fails, so the preview always
  // works — and log nothing misleading either way.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch('/api/demo-products');
        if (!response.ok) throw new Error(`status ${response.status}`);
        const data: { products: DemoProduct[] } = await response.json();
        if (!cancelled && Array.isArray(data.products)) {
          setCatalog({ products: data.products, loading: false });
          return;
        }
      } catch {
        // API unavailable — use the same in-repo sample data.
      }
      if (!cancelled) setCatalog({ products: DEMO_PRODUCTS, loading: false });
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const changeTab = useCallback((next: AppTab) => {
    setTab(next);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const openProduct = useCallback(
    (product: DemoProduct) => {
      setSelectedHandle(product.handle);
      changeTab('demo');
    },
    [changeTab],
  );

  const goToDepartment = useCallback(
    (department: string) => {
      setDepartmentFilter(department);
      changeTab('storefront');
      // Wait for the storefront to mount, then land on the product grid.
      window.requestAnimationFrame(() => {
        document
          .getElementById('products-grid')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [changeTab],
  );

  const firstAvailable =
    catalog.products.find((p) => p.available) ?? catalog.products[0];
  const selectedProduct =
    catalog.products.find((p) => p.handle === selectedHandle) ?? firstAvailable;

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-[var(--mc-bg)]">
      <AnnouncementBar />
      <Header activeTab={tab} onTabChange={changeTab} />

      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
          {tab === 'storefront' && (
            <StorefrontPreview
              products={catalog.products}
              loading={catalog.loading}
              departmentFilter={departmentFilter}
              onDepartmentChange={setDepartmentFilter}
              onView={openProduct}
              onFindGift={() => changeTab('finder')}
            />
          )}

          {tab === 'finder' && <GiftFinder onView={openProduct} />}

          {tab === 'demo' &&
            (selectedProduct ? (
              <ProductDemo
                product={selectedProduct}
                products={catalog.products}
                onProductChange={openProduct}
              />
            ) : (
              <p className="py-24 text-center text-sm text-[var(--mc-ink-soft)]">
                Loading the sample catalogue…
              </p>
            ))}

          {tab === 'wishlist' && (
            <WishlistView
              products={catalog.products}
              onView={openProduct}
              onBrowse={() => changeTab('storefront')}
            />
          )}

          {tab === 'delivery' && <DeliveryView />}

          {tab === 'report' && <ReportView />}
        </div>
      </main>

      <Footer onDepartment={goToDepartment} />
      <CartDrawer onBrowse={() => changeTab('storefront')} />
    </div>
  );
}

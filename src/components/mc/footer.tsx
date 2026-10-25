'use client';

// Sticky footer (mt-auto inside the page's min-h-screen flex column).
// Shows ONLY verified store info (src/lib/store-info.ts) — no invented fields.
// The Shop column drives the storefront preview's department filter.

import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { DEPARTMENTS } from '@/lib/catalog';
import { translate, useLangStore } from '@/lib/i18n';
import { STORE_INFO } from '@/lib/store-info';

export function Footer({
  onDepartment,
}: {
  onDepartment: (department: string) => void;
}) {
  const lang = useLangStore((s) => s.lang);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--mc-border)] bg-[var(--mc-bg-soft)] pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Shop — real department names, wired to the storefront filter */}
        <nav aria-label={translate(lang, 'footer.shop')}>
          <h2 className="font-heading text-lg text-[var(--mc-ink)]">
            {translate(lang, 'footer.shop')}
          </h2>
          <ul className="mt-3 space-y-1.5">
            {DEPARTMENTS.map((department) => (
              <li key={department.name}>
                <button
                  type="button"
                  onClick={() => onDepartment(department.name)}
                  className="min-h-11 w-full rounded-md px-1 text-left text-sm text-[var(--mc-ink-soft)] transition-colors duration-[var(--mc-dur)] hover:text-[var(--mc-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mc-accent)]"
                >
                  {department.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Store info — verified owner data only */}
        <div>
          <h2 className="font-heading text-lg text-[var(--mc-ink)]">
            {translate(lang, 'footer.storeInfo')}
          </h2>
          <address className="mt-3 space-y-1 not-italic text-sm text-[var(--mc-ink-soft)]">
            {STORE_INFO.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
          <ul className="mt-3 space-y-1.5 text-sm">
            {STORE_INFO.phones.map((phone) => (
              <li key={phone}>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="inline-flex min-h-11 items-center gap-2 text-[var(--mc-ink-soft)] transition-colors duration-[var(--mc-dur)] hover:text-[var(--mc-accent)]"
                >
                  <Phone aria-hidden="true" className="size-4" />
                  {phone}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${STORE_INFO.email}`}
                className="inline-flex min-h-11 items-center gap-2 break-all text-[var(--mc-ink-soft)] transition-colors duration-[var(--mc-dur)] hover:text-[var(--mc-accent)]"
              >
                <Mail aria-hidden="true" className="size-4 shrink-0" />
                {STORE_INFO.email}
              </a>
            </li>
            <li>
              <a
                href={STORE_INFO.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center gap-2 text-[var(--mc-ink-soft)] transition-colors duration-[var(--mc-dur)] hover:text-[var(--mc-accent)]"
              >
                <Instagram aria-hidden="true" className="size-4" />
                Instagram — @mahadev_cutlery
              </a>
            </li>
            <li>
              <a
                href={STORE_INFO.mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center gap-2 text-[var(--mc-ink-soft)] transition-colors duration-[var(--mc-dur)] hover:text-[var(--mc-accent)]"
              >
                <MapPin aria-hidden="true" className="size-4" />
                Open in Google Maps
              </a>
            </li>
          </ul>
        </div>

        {/* About — honest one-liner */}
        <div className="sm:col-span-2">
          <h2 className="font-heading text-lg text-[var(--mc-ink)]">
            {translate(lang, 'footer.about')}
          </h2>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-[var(--mc-ink-soft)]">
            {STORE_INFO.name} is a family-run gift &amp; lifestyle shop in
            Vastral, Ahmedabad. This site is the theme studio preview for its
            new Shopify theme: every product here is a clearly labeled SAMPLE,
            and the live store opens after the owner imports the real catalogue.
          </p>
          <p className="mt-3 max-w-prose text-xs leading-relaxed text-[var(--mc-ink-soft)]">
            Interface languages: English · हिंदी · ગુજરાતી (demo selector in the
            top bar). Full-store translation requires Shopify Settings →
            Languages + the Translate &amp; Adapt app.
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--mc-border)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-[var(--mc-ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {STORE_INFO.name}
          </p>
          <p>Theme studio preview — not the live store.</p>
        </div>
      </div>
    </footer>
  );
}

'use client';

// Newsletter strip + dark site footer with owner-verified contact details.

import { useState } from 'react';
import { ArrowRight, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { STORE } from '@/lib/boutique';
import { useLang } from '@/lib/i18n';
import { CONTAINER, Reveal, SECTION_PAD } from './primitives';
import { Logo } from './primitives';
import { LanguageSwitcher } from './language-switcher';

export function Newsletter() {
  const { t, tf } = useLang();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section className={`${SECTION_PAD} bg-cream`} data-testid="newsletter-section">
      <Reveal className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-2`}>
        <div>
          <p className="eyebrow mb-3.5">{t('Newsletter')}</p>
          <h2 className="mb-2.5 text-[clamp(30px,3.4vw,46px)]">{t('Be the first to know')}</h2>
          <p className="text-ink-2">{t('New arrivals and store updates. Unsubscribe any time.')}</p>
        </div>
        {done ? (
          <p className="text-ok" role="status" data-testid="newsletter-success">
            {tf(
              'Preview only. On Shopify, {email} would be saved as a customer with email marketing consent.',
              { email },
            )}
          </p>
        ) : (
          <form
            className="flex flex-wrap gap-2.5"
            onSubmit={(event) => {
              event.preventDefault();
              setDone(true);
            }}
          >
            <label htmlFor="nl" className="sr-only">
              {t('Email address')}
            </label>
            <input
              id="nl"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('Your email address')}
              className="min-h-[52px] flex-[1_1_240px] rounded-[2px] border border-line bg-paper px-[18px] outline-none focus:border-ink"
              data-testid="newsletter-email-input"
            />
            <button
              type="submit"
              className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-[2px] bg-ink px-7 text-[13px] font-semibold tracking-[0.08em] text-warm uppercase transition-colors hover:bg-gold"
              data-testid="newsletter-submit-button"
            >
              {t('Subscribe')}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        )}
      </Reveal>
    </section>
  );
}

const FOOTER_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'Shop all', href: '#departments' },
      { label: 'New arrivals', href: '#new-arrivals' },
      { label: 'Offers', href: '#offers' },
      { label: 'Brands A–Z', href: '#brands-az' },
    ],
  },
  {
    heading: 'Departments',
    links: [
      { label: 'Beauty & Makeup', href: '#departments' },
      { label: 'Skincare', href: '#skincare-edit' },
      { label: 'Haircare', href: '#departments' },
      { label: 'Hosiery & Innerwear', href: '#innerwear-edit' },
      { label: 'Toys & Kids', href: '#gifts-edit' },
      { label: 'Gift Articles', href: '#gifts-edit' },
    ],
  },
  {
    heading: 'Customer care',
    links: [
      { label: 'Contact', href: '#top' },
      { label: 'Shipping policy', href: '#top' },
      { label: 'Refund policy', href: '#top' },
      { label: 'Privacy policy', href: '#top' },
      { label: 'Terms of service', href: '#top' },
    ],
  },
];

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-ink text-sm text-warm/90" data-testid="site-footer">
      <div
        className={`${CONTAINER} grid gap-10 pt-16 pb-12 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]`}
      >
        <div className="grid content-start gap-5 md:col-span-3 lg:col-span-1">
          <Logo light />
          <p className="max-w-[34ch] text-warm/65">
            {t(
              'A multi-brand store for beauty, skincare, haircare, innerwear, kids\' toys, gifts and imitation jewellery.',
            )}
          </p>
          <a
            href={STORE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            data-testid="footer-instagram-link"
            className="grid size-[42px] place-items-center rounded-full border border-warm/20 transition-colors hover:border-gold hover:bg-gold"
          >
            <Instagram className="size-[18px]" strokeWidth={1.5} />
          </a>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            <p className="mb-4 text-[11.5px] font-semibold tracking-[0.2em] text-warm uppercase">
              {t(column.heading)}
            </p>
            <ul className="grid gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-warm/70 transition-colors hover:text-warm">
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div data-testid="footer-contact">
          <p className="mb-4 text-[11.5px] font-semibold tracking-[0.2em] text-warm uppercase">
            {t('Visit us')}
          </p>
          <ul className="grid gap-3 text-warm/70">
            <li className="grid grid-cols-[20px_1fr] gap-2.5">
              <MapPin className="mt-0.5 size-[18px] text-blush" strokeWidth={1.5} />
              <span>
                {STORE.address}
                <br />
                <a
                  href={STORE.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-[3px]"
                  data-testid="footer-maps-link"
                >
                  {t('View on Google Maps')}
                </a>
              </span>
            </li>
            <li className="grid grid-cols-[20px_1fr] gap-2.5">
              <Phone className="mt-0.5 size-[18px] text-blush" strokeWidth={1.5} />
              <span>
                {STORE.phones.map((phone, i) => (
                  <span key={phone}>
                    {i > 0 && ', '}
                    <a href={`tel:+91${phone}`} data-testid={`footer-phone-${i}`}>
                      {phone}
                    </a>
                  </span>
                ))}
              </span>
            </li>
            <li className="grid grid-cols-[20px_1fr] gap-2.5">
              <Mail className="mt-0.5 size-[18px] text-blush" strokeWidth={1.5} />
              <a href={`mailto:${STORE.email}`} data-testid="footer-email-link">
                {STORE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={`${CONTAINER} flex flex-wrap items-center justify-between gap-4 border-t border-warm/10 pt-5 pb-8 text-[12.5px] text-warm/55`}
      >
        <p>
          © {new Date().getFullYear()} {STORE.name}. {t('All rights reserved.')}
        </p>
        <div className="flex items-center gap-4">
          <p>{t('Policies are listed automatically from Shopify Admin.')}</p>
          <div className="[&_button]:text-warm/70 [&_button:hover]:text-warm [&_svg]:text-warm/70">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}

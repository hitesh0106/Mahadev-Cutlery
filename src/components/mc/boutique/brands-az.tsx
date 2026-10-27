'use client';

// Brands A–Z directory — sticky search + alphabet filter, letter-grouped
// columns built from the single brand list (30 brands).

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ALL_BRANDS } from '@/lib/boutique';
import { openBrowse } from '@/lib/browse-store';
import { useLang } from '@/lib/i18n';
import { CONTAINER, SECTION_PAD, SectionHead } from './primitives';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

function firstLetter(value: string) {
  const letter = value.normalize('NFD')[0].toUpperCase();
  return /[A-Z]/.test(letter) ? letter : '#';
}

export function BrandsAZ() {
  const [query, setQuery] = useState('');
  const { t, tf } = useLang();

  const filtered = useMemo(
    () => ALL_BRANDS.filter((b) => b.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );
  const groups = LETTERS.map((letter) => ({
    letter,
    items: filtered.filter((brand) => firstLetter(brand) === letter),
  })).filter((group) => group.items.length);
  const availableLetters = new Set(ALL_BRANDS.map(firstLetter));

  return (
    <section id="brands-az" className={SECTION_PAD} data-testid="brand-directory-section">
      <div className={CONTAINER}>
        <SectionHead
          eyebrow={t('Brand directory')}
          title={t('Brands A–Z')}
          text={t(
            'In the live theme this list builds itself from your product vendors, so each brand appears once and only if it has products.',
          )}
        />
        <div className="sticky top-16 z-[5] mb-7 grid gap-3.5 border-b border-line bg-paper py-3.5 lg:top-[68px]">
          <label className="flex max-w-[420px] items-center gap-2.5 rounded-[2px] border border-line px-3.5">
            <Search className="size-5" strokeWidth={1.5} />
            <span className="sr-only">{t('Search brands')}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tf('Search {count} brands', { count: ALL_BRANDS.length })}
              className="min-h-[46px] min-w-0 flex-1 bg-transparent outline-none"
              data-testid="brand-directory-search"
            />
          </label>
          <nav className="flex flex-wrap gap-0.5" aria-label={t('Brands by letter')}>
            {LETTERS.map((letter) =>
              availableLetters.has(letter) ? (
                <a
                  key={letter}
                  href={`#brands-${letter}`}
                  data-testid={`brand-letter-${letter === '#' ? 'num' : letter}`}
                  className="grid size-[34px] place-items-center rounded-full text-[13px] font-semibold transition-colors hover:bg-ink hover:text-warm"
                >
                  {letter}
                </a>
              ) : (
                <span
                  key={letter}
                  aria-hidden
                  className="grid size-[34px] place-items-center text-[13px] font-semibold text-line"
                >
                  {letter}
                </span>
              ),
            )}
          </nav>
        </div>
        {groups.length ? (
          <div className="columns-2 gap-6 sm:columns-3 lg:columns-4 lg:gap-10">
            {groups.map((group) => (
              <div
                key={group.letter}
                id={`brands-${group.letter}`}
                className="mb-7 break-inside-avoid scroll-mt-60"
                data-testid={`brand-group-${group.letter === '#' ? 'num' : group.letter}`}
              >
                <h3 className="mb-2.5 border-b border-line pb-2 text-[34px] text-gold">
                  {group.letter}
                </h3>
                <ul className="grid gap-0.5">
                  {group.items.map((brand) => (
                    <li key={brand}>
                      <a
                        href={`#brand-${brand.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                        onClick={(event) => {
                          event.preventDefault();
                          openBrowse({ kind: 'brand', name: brand });
                        }}
                        data-testid={`brand-link-${brand.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                        className="inline-block py-1 text-[15px] transition-[color,transform] duration-300 hover:translate-x-[3px] hover:text-gold"
                      >
                        {brand}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-2" data-testid="brand-directory-empty">
            {t('No brand matches your search.')}
          </p>
        )}
      </div>
    </section>
  );
}

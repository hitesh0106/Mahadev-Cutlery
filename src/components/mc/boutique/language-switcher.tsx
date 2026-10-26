'use client';

// Language switcher — EN / हिन्दी / ગુજરાતી dropdown for the preview interface.
// Mirrors the theme's language-selector snippet: interface strings only;
// brand names, product titles and prices are never translated. Persists to
// localStorage and keeps <html lang> in sync.

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { LANGUAGES, setLang, syncDocumentLang, useLang, type Lang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    syncDocumentLang();
  }, [lang]);

  useEffect(() => {
    if (!open) return;
    const onOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative" data-testid="language-switcher">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('Change language')}
        data-testid="language-switcher-button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 items-center gap-1 rounded-full px-1.5 text-[12.5px] font-semibold tracking-[0.06em] transition-colors hover:bg-stone sm:gap-1.5 sm:px-2.5"
      >
        <Languages className="size-[18px]" strokeWidth={1.5} />
        <span className="hidden sm:inline">
          {LANGUAGES.find((l) => l.code === lang)?.short}
        </span>
        <ChevronDown
          className={cn(
            'hidden size-3.5 opacity-60 transition-transform duration-200 sm:block',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t('Language')}
          data-testid="language-menu"
          className="absolute top-[calc(100%+6px)] right-0 z-[60] w-[264px] rounded-sm border border-line bg-paper py-2 shadow-[0_18px_40px_rgba(32,32,30,.12)]"
        >
          {LANGUAGES.map((option) => (
            <button
              key={option.code}
              type="button"
              role="option"
              aria-selected={option.code === lang}
              data-testid={`language-option-${option.code}`}
              onClick={() => {
                setLang(option.code as Lang);
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-[14px] transition-colors hover:bg-warm',
                option.code === lang && 'font-semibold',
              )}
            >
              <span>{option.label}</span>
              {option.code === lang && <Check className="size-4 text-gold" />}
            </button>
          ))}
          <p className="mt-1.5 border-t border-line px-4 pt-2.5 text-[11.5px] leading-normal text-ink-2">
            {t('Interface language for this preview. Full storefront translation is configured in Shopify.')}
          </p>
        </div>
      )}
    </div>
  );
}

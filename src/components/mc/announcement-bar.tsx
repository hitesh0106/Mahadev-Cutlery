'use client';

// Persistent honesty strip: this is a design preview with demo data.
// Includes the demo-language selector (EN / हिंदी / ગુજરાતી) with an honest
// scope note — it only changes this showcase's interface language.

import { Check, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  I18N_SCOPE_NOTE,
  LANGUAGE_OPTIONS,
  useLangStore,
} from '@/lib/i18n';

export function AnnouncementBar() {
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const current = LANGUAGE_OPTIONS.find((option) => option.value === lang) ?? LANGUAGE_OPTIONS[0];

  return (
    <div className="bg-[var(--mc-ink)] text-[var(--mc-cream)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="flex items-start gap-2 leading-snug">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-block size-2 shrink-0 rounded-full bg-[var(--mc-accent)]"
          />
          <span>
            <span className="font-semibold tracking-wide text-[var(--mc-accent-soft)]">
              SAMPLE CATALOGUE
            </span>{' '}
            — Design preview with demo data. Real catalogue lives in Shopify
            after the owner imports products.
          </span>
        </p>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger
                  aria-label={`Interface language: ${current.english}. Opens language menu.`}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--mc-cream)] transition-colors duration-[var(--mc-dur)] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mc-accent)]"
                >
                  <Globe aria-hidden="true" className="size-3.5" />
                  <span>{current.native}</span>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className="max-w-64 bg-[var(--mc-ink)] text-[var(--mc-cream)]">
                {I18N_SCOPE_NOTE}
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Interface language</DropdownMenuLabel>
              {LANGUAGE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setLang(option.value)}
                  aria-pressed={option.value === lang}
                  className="justify-between"
                >
                  <span>
                    {option.native}
                    <span className="ml-2 text-muted-foreground">{option.english}</span>
                  </span>
                  {option.value === lang && (
                    <Check aria-hidden="true" className="size-4 text-[var(--mc-accent)]" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
